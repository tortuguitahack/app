from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime


class Category(BaseModel):
    id: str  # 'whiskey', 'wine', 'champagne'
    name: str
    description: str
    image: str
    count: int = 0
    createdAt: datetime = Field(default_factory=datetime.utcnow)
    updatedAt: datetime = Field(default_factory=datetime.utcnow)


class CategoryCreate(BaseModel):
    id: str
    name: str
    description: str
    image: str


class CategoryUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    image: Optional[str] = None