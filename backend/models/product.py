from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime
import uuid


class Product(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    category: str  # 'whiskey', 'wine', 'champagne'
    brand: str
    price: float
    description: str
    image: str
    inStock: bool = True
    featured: bool = False
    alcohol: float  # ABV percentage
    inventory: int = 0
    createdAt: datetime = Field(default_factory=datetime.utcnow)
    updatedAt: datetime = Field(default_factory=datetime.utcnow)


class ProductCreate(BaseModel):
    name: str
    category: str
    brand: str
    price: float
    description: str
    image: str
    inStock: bool = True
    featured: bool = False
    alcohol: float
    inventory: int = 0


class ProductUpdate(BaseModel):
    name: Optional[str] = None
    category: Optional[str] = None
    brand: Optional[str] = None
    price: Optional[float] = None
    description: Optional[str] = None
    image: Optional[str] = None
    inStock: Optional[bool] = None
    featured: Optional[bool] = None
    alcohol: Optional[float] = None
    inventory: Optional[int] = None