from fastapi import APIRouter, HTTPException
from typing import List
from motor.motor_asyncio import AsyncIOMotorClient
import os

from models.category import Category, CategoryCreate, CategoryUpdate

router = APIRouter(prefix="/api/categories", tags=["categories"])

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]


@router.get("/", response_model=List[Category])
async def get_categories():
    """Get all categories with product counts"""
    try:
        # Get categories
        categories_cursor = db.categories.find()
        categories = await categories_cursor.to_list(100)
        
        # Calculate product counts for each category
        result_categories = []
        for category in categories:
            # Count products in this category
            product_count = await db.products.count_documents({"category": category["id"]})
            category["count"] = product_count
            result_categories.append(Category(**category))
        
        return result_categories
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching categories: {str(e)}")


@router.post("/", response_model=Category)
async def create_category(category_data: CategoryCreate):
    """Create new category"""
    try:
        # Check if category already exists
        existing = await db.categories.find_one({"id": category_data.id})
        if existing:
            raise HTTPException(status_code=400, detail="Category already exists")
        
        category = Category(**category_data.dict())
        category_dict = category.dict()
        await db.categories.insert_one(category_dict)
        
        # Count products for this category
        product_count = await db.products.count_documents({"category": category.id})
        category.count = product_count
        
        return category
    except Exception as e:
        if "Category already exists" in str(e):
            raise e
        raise HTTPException(status_code=500, detail=f"Error creating category: {str(e)}")


@router.put("/{category_id}", response_model=Category)
async def update_category(category_id: str, category_data: CategoryUpdate):
    """Update category"""
    try:
        # Check if category exists
        existing_category = await db.categories.find_one({"id": category_id})
        if not existing_category:
            raise HTTPException(status_code=404, detail="Category not found")
        
        # Prepare update data
        update_data = {k: v for k, v in category_data.dict().items() if v is not None}
        
        # Update category
        await db.categories.update_one(
            {"id": category_id},
            {"$set": update_data}
        )
        
        # Return updated category with product count
        updated_category = await db.categories.find_one({"id": category_id})
        product_count = await db.products.count_documents({"category": category_id})
        updated_category["count"] = product_count
        
        return Category(**updated_category)
    except Exception as e:
        if "Category not found" in str(e):
            raise e
        raise HTTPException(status_code=500, detail=f"Error updating category: {str(e)}")