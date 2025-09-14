from fastapi import APIRouter, HTTPException, Query, Depends
from typing import List, Optional
from datetime import datetime

from models.product import Product, ProductCreate, ProductUpdate

router = APIRouter(prefix="/api/products", tags=["products"])

# Database will be injected via dependency
async def get_database():
    from server import db
    return db


@router.get("/", response_model=List[Product])
async def get_products(
    category: Optional[str] = Query(None),
    search: Optional[str] = Query(None),
    featured: Optional[bool] = Query(None),
    inStock: Optional[bool] = Query(None),
    db = Depends(get_database)
):
    """Get all products with optional filtering"""
    filter_query = {}
    
    if category:
        filter_query["category"] = category
    if featured is not None:
        filter_query["featured"] = featured
    if inStock is not None:
        filter_query["inStock"] = inStock
    if search:
        filter_query["$or"] = [
            {"name": {"$regex": search, "$options": "i"}},
            {"brand": {"$regex": search, "$options": "i"}},
            {"description": {"$regex": search, "$options": "i"}},
            {"category": {"$regex": search, "$options": "i"}}
        ]
    
    try:
        products_cursor = db.products.find(filter_query)
        products = await products_cursor.to_list(1000)
        return [Product(**product) for product in products]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching products: {str(e)}")


@router.get("/{product_id}", response_model=Product)
async def get_product(product_id: str, db = Depends(get_database)):
    """Get single product by ID"""
    try:
        product = await db.products.find_one({"id": product_id})
        if not product:
            raise HTTPException(status_code=404, detail="Product not found")
        return Product(**product)
    except Exception as e:
        if "Product not found" in str(e):
            raise e
        raise HTTPException(status_code=500, detail=f"Error fetching product: {str(e)}")


@router.post("/", response_model=Product)
async def create_product(product_data: ProductCreate, db = Depends(get_database)):
    """Create new product"""
    try:
        product = Product(**product_data.dict())
        product_dict = product.dict()
        await db.products.insert_one(product_dict)
        return product
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error creating product: {str(e)}")


@router.put("/{product_id}", response_model=Product)
async def update_product(product_id: str, product_data: ProductUpdate, db = Depends(get_database)):
    """Update product"""
    try:
        # Check if product exists
        existing_product = await db.products.find_one({"id": product_id})
        if not existing_product:
            raise HTTPException(status_code=404, detail="Product not found")
        
        # Prepare update data
        update_data = {k: v for k, v in product_data.dict().items() if v is not None}
        update_data["updatedAt"] = datetime.utcnow()
        
        # Update product
        await db.products.update_one(
            {"id": product_id},
            {"$set": update_data}
        )
        
        # Return updated product
        updated_product = await db.products.find_one({"id": product_id})
        return Product(**updated_product)
    except Exception as e:
        if "Product not found" in str(e):
            raise e
        raise HTTPException(status_code=500, detail=f"Error updating product: {str(e)}")


@router.delete("/{product_id}")
async def delete_product(product_id: str, db = Depends(get_database)):
    """Delete product"""
    try:
        result = await db.products.delete_one({"id": product_id})
        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Product not found")
        return {"message": "Product deleted successfully"}
    except Exception as e:
        if "Product not found" in str(e):
            raise e
        raise HTTPException(status_code=500, detail=f"Error deleting product: {str(e)}")