from fastapi import FastAPI, Depends
from sqlalchemy import text
from sqlalchemy.orm import Session

from .config import settings
from app.database import get_db
from app.routers.auth import router as auth_router
from app.routers.consent import router as consent_router
from app.routers.patients import router as patients_router
from app.routers.conversations import router as conversations_router
from app.routers.history import router as history_router
from app.routers.documents import router as documents_router
from app.routers.summaries import router as summaries_router
from app.routers.physicians import router as physicians_router
from app.routers.emergency import router as emergency_router
from app.routers.admin import router as admin_router
from app.routers.abdm import router as abdm_router
from fastapi.middleware.cors import CORSMiddleware










app = FastAPI(
    title=settings.APP_NAME,
    description="Clinova AI Clinical History Backend",
    version="1.0.0",
)



app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)







app.include_router(auth_router)
app.include_router(patients_router)
app.include_router(consent_router)
app.include_router(conversations_router)
app.include_router(history_router)
app.include_router(documents_router)
app.include_router(summaries_router)
app.include_router(physicians_router)
app.include_router(emergency_router)
app.include_router(admin_router)
app.include_router(abdm_router)


@app.get("/")
def root():
    return {
        "message": "Clinova backend is running",
        "environment": settings.APP_ENV,
    }


@app.get("/health")
def health_check():
    return {"status": "healthy"}


@app.get("/health/database")
def database_health_check(
    db: Session = Depends(get_db),
):
    result = db.execute(text("SELECT 1"))
    value = result.scalar()

    return {
        "database": "connected",
        "test": value,
    }