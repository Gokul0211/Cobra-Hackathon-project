import anthropic
import aiosqlite
import asyncio
import json
from datetime import datetime, timezone
from config import ANTHROPIC_API_KEY, DATABASE_PATH, CLAUDE_MODEL


SYSTEM_PROMPT = """You are a neutral, factual surveillance infrastructure analyst. 
You analyze OSINT data about surveillance technology deployments and produce concise, accurate risk assessments. 
You never editorialize, you never take political sides, and you always distinguish between confirmed facts and inferred assessments. 
Your writing style is Reuters wire service — precise, factual, dense."""


def _build_user_prompt(req: dict) -> str:
    """Build the user prompt for Claude from cluster data."""
    owner_str = ", ".join(f"{k}: {v}" for k, v in req["owner_types"].items() if v > 0)
    news_str = "\n".join(f"- {h}" for h in req.get("nearby_news_headlines", [])) or "No recent news found."
    return f"""Given the following surveillance infrastructure data, write a factual 3-paragraph risk brief.

Location: {req["area_description"]}, {req["city"]}
Devices detected: {req["device_count"]}
Device types: {", ".join(req["device_types"])}
Manufacturers: {", ".join(req["manufacturers"])}
Ownership breakdown: {owner_str}
Recent news context:
{news_str}

Write exactly 3 paragraphs:
1. Technical summary — what infrastructure exists and its capabilities
2. Ownership and operational context — who controls it and any known usage context from the news
3. Risk assessment — proportionality, legal grounding, and any concerning patterns

Rules: No bullet points. No headers. No editorializing. No activist language. 
Write like a Reuters journalist, not an activist. Be factual and neutral."""


def _extract_risk_level(text: str) -> str:
    """Extract risk level from brief text using weighted keyword scoring."""
    text_lower = text.lower()
    scores = {"CRITICAL": 0, "HIGH": 0, "MEDIUM": 0, "LOW": 0}

    for w in ["critical", "severely", "alarming", "grave", "urgent", "pervasive", "unchecked"]:
        if w in text_lower:
            scores["CRITICAL"] += 3
    for w in ["high risk", "significant concern", "substantial", "disproportionate",
              "excessive", "no oversight", "legal vacuum", "unauthorized"]:
        if w in text_lower:
            scores["HIGH"] += 2
    for w in ["moderate", "warrants attention", "notable", "raises questions",
              "unclear", "inconsistent", "limited oversight", "opaque"]:
        if w in text_lower:
            scores["MEDIUM"] += 1
    for w in ["proportionate", "adequate", "standard", "routine", "established framework"]:
        if w in text_lower:
            scores["LOW"] += 1

    best = max(scores, key=scores.get)
    return best if scores[best] > 0 else "MEDIUM"


async def _get_cached_brief(cluster_id: str) -> dict | None:
    """Check if we have a cached brief for this cluster."""
    async with aiosqlite.connect(DATABASE_PATH) as db:
        db.row_factory = aiosqlite.Row
        async with db.execute(
            "SELECT * FROM risk_briefs WHERE cluster_id = ?", (cluster_id,)
        ) as cursor:
            row = await cursor.fetchone()
            return dict(row) if row else None


async def _save_brief(cluster_id: str, city: str, brief_text: str, risk_level: str):
    """Save a generated brief to the SQLite cache."""
    async with aiosqlite.connect(DATABASE_PATH) as db:
        await db.execute("""
            INSERT OR REPLACE INTO risk_briefs
            (cluster_id, city, brief_text, risk_level, generated_at)
            VALUES (?, ?, ?, ?, ?)
        """, (cluster_id, city, brief_text, risk_level, datetime.now(timezone.utc).isoformat()))
        await db.commit()


async def generate_brief(req: dict) -> dict:
    """Generate a risk brief. Returns from cache if available, otherwise calls Claude."""
    cluster_id = req["cluster_id"]

    cached = await _get_cached_brief(cluster_id)
    if cached:
        return {
            "cluster_id": cluster_id,
            "brief_text": cached["brief_text"],
            "risk_level": cached["risk_level"],
            "from_cache": True,
        }

    if not ANTHROPIC_API_KEY:
        return {
            "cluster_id": cluster_id,
            "brief_text": "Analysis unavailable — API key not configured.",
            "risk_level": "MEDIUM",
            "from_cache": False,
        }

    client = anthropic.Anthropic(api_key=ANTHROPIC_API_KEY)
    loop = asyncio.get_event_loop()

    def _call():
        message = client.messages.create(
            model=CLAUDE_MODEL, max_tokens=1000,
            system=SYSTEM_PROMPT,
            messages=[{"role": "user", "content": _build_user_prompt(req)}]
        )
        return message.content[0].text

    try:
        brief_text = await loop.run_in_executor(None, _call)
    except Exception as e:
        print(f"[claude error] {e}")
        return {
            "cluster_id": cluster_id,
            "brief_text": f"Analysis temporarily unavailable.",
            "risk_level": "MEDIUM",
            "from_cache": False,
        }

    risk_level = _extract_risk_level(brief_text)
    await _save_brief(cluster_id, req["city"], brief_text, risk_level)

    return {
        "cluster_id": cluster_id,
        "brief_text": brief_text,
        "risk_level": risk_level,
        "from_cache": False,
    }


async def generate_brief_stream(req: dict):
    """Stream a risk brief via SSE for typewriter effect."""
    cluster_id = req["cluster_id"]

    cached = await _get_cached_brief(cluster_id)
    if cached:
        yield f"data: {json.dumps({'type': 'text', 'content': cached['brief_text']})}\n\n"
        yield f"data: {json.dumps({'type': 'done', 'risk_level': cached['risk_level']})}\n\n"
        return

    if not ANTHROPIC_API_KEY:
        yield f"data: {json.dumps({'type': 'text', 'content': 'Analysis unavailable — API key not configured.'})}\n\n"
        yield f"data: {json.dumps({'type': 'done', 'risk_level': 'MEDIUM'})}\n\n"
        return

    client = anthropic.Anthropic(api_key=ANTHROPIC_API_KEY)
    full_text = ""

    try:
        with client.messages.stream(
            model=CLAUDE_MODEL, max_tokens=1000,
            system=SYSTEM_PROMPT,
            messages=[{"role": "user", "content": _build_user_prompt(req)}]
        ) as stream:
            for text in stream.text_stream:
                full_text += text
                yield f"data: {json.dumps({'type': 'chunk', 'content': text})}\n\n"

        risk_level = _extract_risk_level(full_text)
        await _save_brief(cluster_id, req["city"], full_text, risk_level)
        yield f"data: {json.dumps({'type': 'done', 'risk_level': risk_level})}\n\n"
    except Exception as e:
        print(f"[claude stream error] {e}")
        yield f"data: {json.dumps({'type': 'error', 'message': str(e)[:100]})}\n\n"
