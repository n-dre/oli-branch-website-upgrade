import os
import uuid
import hashlib
import logging
from pathlib import Path
from datetime import datetime, timezone, timedelta
from typing import List, Optional

from fastapi import FastAPI, APIRouter, HTTPException, status, Depends
from fastapi.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel, Field, ConfigDict, EmailStr
from dotenv import load_dotenv
from contextlib import asynccontextmanager
from jose import JWTError, jwt
from passlib.context import CryptContext

# --- CONFIGURATION & PATHS ---
ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# JWT Security Settings
SECRET_KEY = os.environ.get("JWT_SECRET", "oli_branch_secure_2026_key")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24  # 24-hour token

# Password Hashing Setup
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# --- DATABASE CONNECTION ---
mongo_url = os.environ['MONGO_URL']
db_name = os.environ['DB_NAME']
client = AsyncIOMotorClient(mongo_url)
db = client[db_name]

@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("Connecting to MongoDB...")
    yield
    client.close()
    logger.info("MongoDB connection closed.")

# --- MODELS (USER, AUTH, & STATUS) ---

class StatusCheckBase(BaseModel):
    client_name: str

class StatusCheck(StatusCheckBase):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class UserSignup(BaseModel):
    email: EmailStr
    password: str
    name: str
    business_name: Optional[str] = None
    entity_type: Optional[str] = None
    monthly_revenue: Optional[float] = None
    account_type: Optional[str] = None
    monthly_banking_fees: Optional[float] = None
    zip_code: Optional[str] = None
    phone: Optional[str] = None
    cash_deposits: Optional[bool] = False
    funding_interest: Optional[bool] = False
    is_veteran: Optional[bool] = False
    is_immigrant: Optional[bool] = False

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str
    user_name: str

class UserResponse(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str
    email: EmailStr
    name: str
    business_name: Optional[str] = None
    entity_type: Optional[str] = None
    monthly_revenue: Optional[float] = None
    account_type: Optional[str] = None
    monthly_banking_fees: Optional[float] = None
    zip_code: Optional[str] = None
    cash_deposits: bool = False
    funding_interest: bool = False
    is_veteran: bool = False
    is_immigrant: bool = False
    created_at: datetime

# --- SECURITY HELPERS ---

def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

# --- API ROUTES ---

app = FastAPI(lifespan=lifespan)
api_router = APIRouter(prefix="/api")

@api_router.get("/")
async def root():
    return {"message": "Oli-Branch API is online and secure"}

# AUTH ENDPOINTS
@api_router.post("/auth/signup", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def signup(user_data: UserSignup):
    """Register a new user with full business mismatch data"""
    email_lower = user_data.email.lower()
    
    # Duplicate check
    existing_user = await db.users.find_one({"email": email_lower})
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    user_id = str(uuid.uuid4())
    now = datetime.now(timezone.utc)
    
    # Prepare Document
    user_doc = user_data.model_dump()
    user_doc.update({
        "id": user_id,
        "email": email_lower,
        "password_hash": get_password_hash(user_data.password),
        "created_at": now.isoformat()
    })
    user_doc.pop("password") # Securely remove raw password
    
    await db.users.insert_one(user_doc)
    
    return {**user_doc, "created_at": now}

@api_router.post("/auth/login", response_model=Token)
async def login(credentials: UserLogin):
    """Login and receive a JWT access token"""
    user = await db.users.find_one({"email": credentials.email.lower()})
    
    if not user or not verify_password(credentials.password, user.get("password_hash")):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    access_token = create_access_token(data={"sub": user["email"], "user_id": user["id"]})
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user_name": user["name"]
    }

# STATUS CHECK ENDPOINTS (Original requirement)
@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input_data: StatusCheckBase):
    status_obj = StatusCheck(client_name=input_data.client_name)
    doc = status_obj.model_dump()
    doc['timestamp'] = doc['timestamp'].isoformat()
    
    await db.status_checks.insert_one(doc)
    return status_obj

@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    status_checks = await db.status_checks.find({}, {"_id": 0}).to_list(1000)
    for check in status_checks:
        if isinstance(check.get('timestamp'), str):
            check['timestamp'] = datetime.fromisoformat(check['timestamp'])
    return status_checks

# --- APP MIDDLEWARE & INIT ---

app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("server:app", host="0.0.0.0", port=3000, reload=True)