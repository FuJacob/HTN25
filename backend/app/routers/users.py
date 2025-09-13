from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List
import uuid

router = APIRouter(prefix="/api/users", tags=["users"])

# Pydantic models
class User(BaseModel):
    id: str
    name: str
    email: str

class UserCreate(BaseModel):
    name: str
    email: str

# In-memory storage for demo purposes
users_db = [
    {"id": "1", "name": "John Doe", "email": "john@example.com"},
    {"id": "2", "name": "Jane Smith", "email": "jane@example.com"}
]

@router.get("/", response_model=List[User])
def get_users():
    """Get all users"""
    return users_db

@router.get("/{user_id}", response_model=User)
def get_user(user_id: str):
    """Get a specific user by ID"""
    for user in users_db:
        if user["id"] == user_id:
            return user
    raise HTTPException(status_code=404, detail="User not found")

@router.post("/", response_model=User)
def create_user(user: UserCreate):
    """Create a new user"""
    new_user = {
        "id": str(uuid.uuid4()),
        "name": user.name,
        "email": user.email
    }
    users_db.append(new_user)
    return new_user

@router.delete("/{user_id}")
def delete_user(user_id: str):
    """Delete a user by ID"""
    for i, user in enumerate(users_db):
        if user["id"] == user_id:
            del users_db[i]
            return {"message": "User deleted successfully"}
    raise HTTPException(status_code=404, detail="User not found")
