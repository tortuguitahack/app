from fastapi import APIRouter, HTTPException
from typing import List
from motor.motor_asyncio import AsyncIOMotorClient
from datetime import datetime
import os

from models.cart import Cart, CartItem, CartItemAdd, CartItemUpdate

router = APIRouter(prefix="/api/cart", tags=["cart"])

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]


@router.get("/{session_id}", response_model=Cart)
async def get_cart(session_id: str):
    """Get cart items for session"""
    try:
        cart = await db.carts.find_one({"sessionId": session_id})
        if not cart:
            # Create new empty cart for session
            new_cart = Cart(sessionId=session_id)
            cart_dict = new_cart.dict()
            await db.carts.insert_one(cart_dict)
            return new_cart
        
        return Cart(**cart)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching cart: {str(e)}")


@router.post("/{session_id}/items")
async def add_item_to_cart(session_id: str, item_data: CartItemAdd):
    """Add item to cart"""
    try:
        # Get product details
        product = await db.products.find_one({"id": item_data.productId})
        if not product:
            raise HTTPException(status_code=404, detail="Product not found")
        
        if not product["inStock"]:
            raise HTTPException(status_code=400, detail="Product is out of stock")
        
        # Get or create cart
        cart = await db.carts.find_one({"sessionId": session_id})
        if not cart:
            new_cart = Cart(sessionId=session_id)
            cart_dict = new_cart.dict()
            await db.carts.insert_one(cart_dict)
            cart = cart_dict
        
        # Check if item already exists in cart
        cart_items = cart.get("items", [])
        existing_item_index = None
        for i, item in enumerate(cart_items):
            if item["productId"] == item_data.productId:
                existing_item_index = i
                break
        
        if existing_item_index is not None:
            # Update quantity of existing item
            cart_items[existing_item_index]["quantity"] += item_data.quantity
        else:
            # Add new item to cart
            new_item = CartItem(
                productId=item_data.productId,
                name=product["name"],
                price=product["price"],
                image=product["image"],
                quantity=item_data.quantity
            )
            cart_items.append(new_item.dict())
        
        # Update cart in database
        await db.carts.update_one(
            {"sessionId": session_id},
            {
                "$set": {
                    "items": cart_items,
                    "updatedAt": datetime.utcnow()
                }
            }
        )
        
        # Return updated cart
        updated_cart = await db.carts.find_one({"sessionId": session_id})
        return Cart(**updated_cart)
        
    except Exception as e:
        if "Product not found" in str(e) or "Product is out of stock" in str(e):
            raise e
        raise HTTPException(status_code=500, detail=f"Error adding item to cart: {str(e)}")


@router.put("/{session_id}/items/{product_id}")
async def update_cart_item(session_id: str, product_id: str, item_data: CartItemUpdate):
    """Update item quantity in cart"""
    try:
        cart = await db.carts.find_one({"sessionId": session_id})
        if not cart:
            raise HTTPException(status_code=404, detail="Cart not found")
        
        # Find and update item
        cart_items = cart.get("items", [])
        item_found = False
        
        for item in cart_items:
            if item["productId"] == product_id:
                if item_data.quantity <= 0:
                    cart_items.remove(item)
                else:
                    item["quantity"] = item_data.quantity
                item_found = True
                break
        
        if not item_found:
            raise HTTPException(status_code=404, detail="Item not found in cart")
        
        # Update cart in database
        await db.carts.update_one(
            {"sessionId": session_id},
            {
                "$set": {
                    "items": cart_items,
                    "updatedAt": datetime.utcnow()
                }
            }
        )
        
        # Return updated cart
        updated_cart = await db.carts.find_one({"sessionId": session_id})
        return Cart(**updated_cart)
        
    except Exception as e:
        if "Cart not found" in str(e) or "Item not found in cart" in str(e):
            raise e
        raise HTTPException(status_code=500, detail=f"Error updating cart item: {str(e)}")


@router.delete("/{session_id}/items/{product_id}")
async def remove_cart_item(session_id: str, product_id: str):
    """Remove item from cart"""
    try:
        cart = await db.carts.find_one({"sessionId": session_id})
        if not cart:
            raise HTTPException(status_code=404, detail="Cart not found")
        
        # Remove item from cart
        cart_items = cart.get("items", [])
        initial_length = len(cart_items)
        cart_items = [item for item in cart_items if item["productId"] != product_id]
        
        if len(cart_items) == initial_length:
            raise HTTPException(status_code=404, detail="Item not found in cart")
        
        # Update cart in database
        await db.carts.update_one(
            {"sessionId": session_id},
            {
                "$set": {
                    "items": cart_items,
                    "updatedAt": datetime.utcnow()
                }
            }
        )
        
        return {"message": "Item removed from cart successfully"}
        
    except Exception as e:
        if "Cart not found" in str(e) or "Item not found in cart" in str(e):
            raise e
        raise HTTPException(status_code=500, detail=f"Error removing cart item: {str(e)}")


@router.delete("/{session_id}")
async def clear_cart(session_id: str):
    """Clear all items from cart"""
    try:
        result = await db.carts.update_one(
            {"sessionId": session_id},
            {
                "$set": {
                    "items": [],
                    "updatedAt": datetime.utcnow()
                }
            }
        )
        
        if result.matched_count == 0:
            raise HTTPException(status_code=404, detail="Cart not found")
        
        return {"message": "Cart cleared successfully"}
        
    except Exception as e:
        if "Cart not found" in str(e):
            raise e
        raise HTTPException(status_code=500, detail=f"Error clearing cart: {str(e)}")