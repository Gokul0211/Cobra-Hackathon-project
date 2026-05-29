"""
Owner type classification logic.
Primary: keyword matching (fast, free).
Fallback: Claude single-word classification (for ambiguous orgs).
"""
from config import OWNER_TYPE_KEYWORDS


def classify_owner_by_keywords(org: str, asn_description: str) -> tuple[str, str]:
    """
    Classify owner type using keyword matching.
    Returns (owner_type, confidence).
    """
    text = f"{org} {asn_description}".lower()

    for owner_type, keywords in OWNER_TYPE_KEYWORDS.items():
        matches = sum(1 for k in keywords if k in text)
        if matches >= 2:
            return owner_type, "high"
        if matches == 1:
            return owner_type, "medium"

    return "unknown", "low"


async def classify_owner_with_claude(org: str, country: str) -> str:
    """
    Use Claude to classify ambiguous orgs that keyword matching couldn't resolve.
    Returns one of: government, corporate, telecom, unknown.
    Only called when keyword matching returns 'unknown' with 'low' confidence.
    """
    from config import ANTHROPIC_API_KEY, CLAUDE_MODEL
    import anthropic
    import asyncio

    if not ANTHROPIC_API_KEY:
        return "unknown"

    client = anthropic.Anthropic(api_key=ANTHROPIC_API_KEY)
    prompt = f"""Classify this organization as one of: government, corporate, telecom, unknown.
Organization name: "{org}"
Country: "{country}"
Respond with only one word: government, corporate, telecom, or unknown."""

    try:
        loop = asyncio.get_event_loop()

        def _call():
            message = client.messages.create(
                model=CLAUDE_MODEL,
                max_tokens=10,
                messages=[{"role": "user", "content": prompt}]
            )
            return message.content[0].text.strip().lower()

        result = await loop.run_in_executor(None, _call)
        if result in ("government", "corporate", "telecom"):
            return result
        return "unknown"
    except Exception:
        return "unknown"
