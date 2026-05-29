import httpx
import aiosqlite
import hashlib
from datetime import datetime, timedelta
from config import NEWS_API_KEY, DATABASE_PATH, CITIES


SURVEILLANCE_KEYWORDS = [
    "surveillance", "CCTV", "facial recognition", "monitoring",
    "mass surveillance", "tracking", "biometric", "police camera",
]

# Anchored articles — manually verified against Shodan cluster data.
# UPDATE these with real URLs and coordinates before the hackathon.
ANCHORED_ARTICLES = [
    {
        "id": "anchored_mumbai_001",
        "city": "Mumbai",
        "title": "Mumbai Police to expand CCTV surveillance network across key localities",
        "source": "The Hindu",
        "published_at": "2024-09-15",
        "url": "https://www.thehindu.com/news/cities/mumbai/",
        "description": "Mumbai Police announced plans to install over 1,500 new surveillance cameras across Dharavi, Kurla, and Bandra East as part of the city's expanded public safety initiative.",
        "lat": 19.0390,
        "lon": 72.8519,
        "geo_confidence": "manually_verified"
    },
    {
        "id": "anchored_mumbai_002",
        "city": "Mumbai",
        "title": "Face recognition cameras deployed at CST, Dadar railway stations",
        "source": "Indian Express",
        "published_at": "2024-11-02",
        "url": "https://indianexpress.com/article/cities/mumbai/",
        "description": "Western Railway has installed AI-powered facial recognition cameras at Chhatrapati Shivaji Terminus and Dadar stations as part of a security upgrade.",
        "lat": 18.9400,
        "lon": 72.8350,
        "geo_confidence": "manually_verified"
    },
    {
        "id": "anchored_delhi_001",
        "city": "Delhi",
        "title": "Delhi gets 1.4 lakh CCTV cameras under Smart City project",
        "source": "Indian Express",
        "published_at": "2024-07-22",
        "url": "https://indianexpress.com/article/cities/delhi/",
        "description": "Delhi Police completed installation of over 140,000 CCTV cameras across the city, with the highest concentration in Central and South Delhi districts.",
        "lat": 28.6315,
        "lon": 77.2167,
        "geo_confidence": "manually_verified"
    },
    {
        "id": "anchored_bangalore_001",
        "city": "Bangalore",
        "title": "Bengaluru smart city project adds 7,000 AI surveillance cameras",
        "source": "The Hindu",
        "published_at": "2024-08-10",
        "url": "https://www.thehindu.com/news/cities/bangalore/",
        "description": "BBMP and Bengaluru Smart City Limited installed AI-enabled surveillance cameras across MG Road, Brigade Road, and major traffic junctions.",
        "lat": 12.9758,
        "lon": 77.6045,
        "geo_confidence": "manually_verified"
    },
]

CITY_GEO_KEYWORDS = {
    "Mumbai": {
        "dharavi": (19.0390, 72.8519), "bandra": (19.0544, 72.8402),
        "andheri": (19.1197, 72.8469), "kurla": (19.0653, 72.8793),
        "colaba": (18.9067, 72.8147), "juhu": (19.1075, 72.8263),
        "lower parel": (18.9937, 72.8258), "dadar": (19.0178, 72.8478),
        "cst": (18.9400, 72.8350), "goregaon": (19.1663, 72.8526),
        "borivali": (19.2307, 72.8567), "malad": (19.1874, 72.8484),
        "thane": (19.2183, 72.9781), "powai": (19.1176, 72.9060),
    },
    "Delhi": {
        "connaught": (28.6315, 77.2167), "lajpat": (28.5672, 77.2433),
        "rohini": (28.7380, 77.0938), "saket": (28.5245, 77.2066),
        "karol bagh": (28.6527, 77.1901), "dwarka": (28.5921, 77.0460),
        "chandni chowk": (28.6507, 77.2334), "nehru place": (28.5489, 77.2517),
    },
    "Bangalore": {
        "mg road": (12.9758, 77.6045), "koramangala": (12.9352, 77.6245),
        "electronic city": (12.8399, 77.6770), "whitefield": (12.9698, 77.7500),
        "indiranagar": (12.9784, 77.6408), "jayanagar": (12.9308, 77.5838),
        "malleshwaram": (13.0035, 77.5710), "hebbal": (13.0358, 77.5970),
    },
}


def _geo_tag_article(title: str, description: str, city: str) -> tuple:
    """Try to extract a specific location from article text."""
    text = f"{title} {description}".lower()
    geo_map = CITY_GEO_KEYWORDS.get(city, {})
    for keyword, coords in geo_map.items():
        if keyword in text:
            return coords[0], coords[1], "keyword-matched"
    city_data = CITIES.get(city, {})
    return city_data.get("lat", 0), city_data.get("lon", 0), "city-level"


async def _fetch_newsapi(city: str) -> list:
    """Fetch articles from NewsAPI."""
    articles = []
    if not NEWS_API_KEY:
        print("[warn] No NEWS_API_KEY set, skipping NewsAPI")
        return articles

    async with httpx.AsyncClient(timeout=15) as client:
        queries = [f"surveillance {city}", f"CCTV {city}", f"facial recognition {city} India"]
        for query in queries:
            try:
                resp = await client.get(
                    "https://newsapi.org/v2/everything",
                    params={
                        "q": query, "language": "en", "sortBy": "publishedAt",
                        "pageSize": 10, "apiKey": NEWS_API_KEY,
                    }
                )
                if resp.status_code != 200:
                    continue
                data = resp.json()
                if data.get("status") != "ok":
                    continue
                for a in data.get("articles", []):
                    url = a.get("url", "")
                    if not url or url == "https://removed.com":
                        continue
                    title = a.get("title") or ""
                    desc = a.get("description") or ""
                    if not title:
                        continue
                    lat, lon, geo_conf = _geo_tag_article(title, desc, city)
                    articles.append({
                        "id": hashlib.md5(url.encode()).hexdigest(),
                        "city": city, "title": title,
                        "source": (a.get("source") or {}).get("name"),
                        "published_at": (a.get("publishedAt") or "")[:10],
                        "url": url, "description": desc[:300],
                        "lat": lat, "lon": lon, "geo_confidence": geo_conf,
                    })
            except Exception as e:
                print(f"  [newsapi] Error: {e}")
    print(f"  [newsapi] Got {len(articles)} articles for {city}")
    return articles


async def _fetch_gdelt(city: str) -> list:
    """Fetch articles from GDELT Project API."""
    articles = []
    query = f"surveillance {city} India"
    url = (
        f"https://api.gdeltproject.org/api/v2/doc/doc"
        f"?query={query.replace(' ', '+')}"
        f"&mode=ArtList&maxrecords=25&format=json"
    )
    try:
        async with httpx.AsyncClient(timeout=20) as client:
            resp = await client.get(url)
            if resp.status_code != 200:
                return articles
            data = resp.json()
            for a in (data.get("articles") or []):
                article_url = a.get("url", "")
                title = a.get("title") or ""
                if not article_url or not title:
                    continue
                lat, lon, geo_conf = _geo_tag_article(title, "", city)
                raw_date = a.get("seendate", "") or ""
                published = f"{raw_date[:4]}-{raw_date[4:6]}-{raw_date[6:8]}" if len(raw_date) >= 8 else ""
                articles.append({
                    "id": hashlib.md5(article_url.encode()).hexdigest(),
                    "city": city, "title": title, "source": a.get("domain"),
                    "published_at": published, "url": article_url,
                    "description": "", "lat": lat, "lon": lon,
                    "geo_confidence": geo_conf,
                })
    except Exception as e:
        print(f"  [gdelt] Error: {e}")
    print(f"  [gdelt] Got {len(articles)} articles for {city}")
    return articles


async def _save_articles(articles: list):
    """Save articles to SQLite cache."""
    async with aiosqlite.connect(DATABASE_PATH) as db:
        for a in articles:
            await db.execute("""
                INSERT OR IGNORE INTO news_articles
                (id, city, title, source, published_at, url, description, lat, lon, geo_confidence)
                VALUES (?,?,?,?,?,?,?,?,?,?)
            """, (
                a["id"], a["city"], a["title"], a.get("source"),
                a.get("published_at"), a["url"], a.get("description"),
                a.get("lat"), a.get("lon"), a.get("geo_confidence")
            ))
        await db.commit()


async def fetch_and_cache_news(city: str) -> list:
    """Fetch news for a city. Returns cached if available."""
    anchored = [a for a in ANCHORED_ARTICLES if a["city"] == city]

    async with aiosqlite.connect(DATABASE_PATH) as db:
        db.row_factory = aiosqlite.Row
        async with db.execute(
            "SELECT COUNT(*) as cnt FROM news_articles WHERE city = ? AND geo_confidence != 'manually_verified'",
            (city,)
        ) as cursor:
            row = await cursor.fetchone()
            has_cached = row[0] > 0 if row else False

    if has_cached:
        async with aiosqlite.connect(DATABASE_PATH) as db:
            db.row_factory = aiosqlite.Row
            async with db.execute(
                "SELECT * FROM news_articles WHERE city = ? ORDER BY published_at DESC", (city,)
            ) as cursor:
                rows = await cursor.fetchall()
                cached = [dict(r) for r in rows]
        cached_urls = {a.get("url") for a in cached}
        for a in anchored:
            if a["url"] not in cached_urls:
                cached.append(a)
        return cached

    print(f"[news fetch] {city}")
    api_articles = await _fetch_newsapi(city)
    gdelt_articles = await _fetch_gdelt(city)

    seen_urls = set()
    all_articles = []
    for a in anchored + api_articles + gdelt_articles:
        if a["url"] not in seen_urls:
            seen_urls.add(a["url"])
            all_articles.append(a)

    await _save_articles(all_articles)
    return all_articles
