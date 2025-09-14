from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime
import uuid


class CartItem(BaseModel):
    productId: str
    name: str
    price: float
    image: str
    quantity: int = 1
    addedAt: datetime = Field(default_factory=datetime.utcnow)


class Cart(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    sessionId: str
    items: List[CartItem] = []
    createdAt: datetime = Field(default_factory=datetime.utcnow)
    updatedAt: datetime = Field(default_factory=datetime.utcnow)


class CartItemAdd(BaseModel):
    productId: str
    quantity: int = 1


class CartItemUpdate(BaseModel):
    quantity: int