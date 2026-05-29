from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from database import init_db
from config import CORS_ORIGINS
from routes import devices, news, brief, heatmap, stats


@asynccontextmanager
async def lifespan(app: FastAPI):
    await init_db()
    yield


app = FastAPI(
    title="SurveillanceWatch API",
    description="OSINT platform mapping surveillance infrastructure deployments",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(devices.router, prefix="/api")
app.include_router(news.router, prefix="/api")
app.include_router(brief.router, prefix="/api")
app.include_router(heatmap.router, prefix="/api")
app.include_router(stats.router, prefix="/api")


@app.get("/health")
async def health():
    return {"status": "ok"}
