import aiosqlite
import asyncio
from config import DATABASE_PATH
import os


async def get_db():
    """Get a database connection. Caller must close it."""
    os.makedirs(os.path.dirname(DATABASE_PATH) or ".", exist_ok=True)
    db = await aiosqlite.connect(DATABASE_PATH)
    db.row_factory = aiosqlite.Row
    await db.execute("PRAGMA journal_mode=WAL")
    return db


async def init_db():
    """Create all tables and indexes."""
    os.makedirs(os.path.dirname(DATABASE_PATH) or ".", exist_ok=True)
    async with aiosqlite.connect(DATABASE_PATH) as db:
        await db.execute("PRAGMA journal_mode=WAL")

        await db.execute("""
            CREATE TABLE IF NOT EXISTS devices (
                id TEXT PRIMARY KEY,
                city TEXT NOT NULL,
                ip TEXT NOT NULL,
                lat REAL,
                lon REAL,
                device_type TEXT,
                manufacturer TEXT,
                ports TEXT,
                owner_org TEXT,
                owner_type TEXT,
                ownership_confidence TEXT,
                first_seen TEXT,
                last_seen TEXT,
                banner_snippet TEXT,
                raw_data TEXT,
                fetched_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)
        await db.execute("""
            CREATE TABLE IF NOT EXISTS news_articles (
                id TEXT PRIMARY KEY,
                city TEXT NOT NULL,
                title TEXT,
                source TEXT,
                published_at TEXT,
                url TEXT UNIQUE,
                description TEXT,
                lat REAL,
                lon REAL,
                geo_confidence TEXT,
                fetched_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)
        await db.execute("""
            CREATE TABLE IF NOT EXISTS risk_briefs (
                cluster_id TEXT PRIMARY KEY,
                city TEXT NOT NULL,
                brief_text TEXT,
                risk_level TEXT,
                generated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)
        await db.execute("""
            CREATE TABLE IF NOT EXISTS cities (
                name TEXT PRIMARY KEY,
                lat REAL,
                lon REAL,
                zoom_level INTEGER,
                last_fetched TIMESTAMP
            )
        """)

        # Indexes for fast lookups — critical for demo speed
        await db.execute("CREATE INDEX IF NOT EXISTS idx_devices_city ON devices(city)")
        await db.execute("CREATE INDEX IF NOT EXISTS idx_devices_owner ON devices(city, owner_type)")
        await db.execute("CREATE INDEX IF NOT EXISTS idx_news_city ON news_articles(city)")
        await db.execute("CREATE INDEX IF NOT EXISTS idx_briefs_city ON risk_briefs(city)")

        await db.commit()


if __name__ == "__main__":
    asyncio.run(init_db())
    print("Database initialized.")
