from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from dotenv import load_dotenv

from app.routes import (
    auth_routes,
    rbac_routes,
    profile_routes
)

from app.routes import (
    auth_routes,
    rbac_routes,
    profile_routes,
    inventory_routes,
    dashboard_routes
)

from app.database import Base, engine
from app import models
from app.routes import auth_routes

# Load environment variables
load_dotenv()

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Textile Waste Intelligence Platform",
    version="1.0.0"
)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Authentication Routes
app.include_router(
    auth_routes.router,
    prefix="/auth",
    tags=["Authentication"]
)

app.include_router(
    rbac_routes.router,
    prefix="/rbac",
    tags=["Role Based Access"]
)

app.include_router(
    profile_routes.router,
    prefix="/profile",
    tags=["User Profile"]
)

app.include_router(
    inventory_routes.router,
    prefix="/inventory",
    tags=["Inventory"]
)

app.include_router(
    dashboard_routes.router,
    prefix="/dashboard",
    tags=["Dashboard"]
)

@app.get("/")
def root():
    return {
        "message": "Welcome to Textile Waste Intelligence Platform API"
    }

@app.get("/health")
def health_check():
    return {
        "status": "Backend Running Successfully"
    }