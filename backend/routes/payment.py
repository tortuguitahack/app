from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import List
import uuid
import qrcode
from io import BytesIO
import base64
from datetime import datetime

router = APIRouter(prefix="/api/payment", tags=["payment"])

# Database will be injected via dependency
async def get_database():
    from server import db
    return db


class PaymentRequest(BaseModel):
    sessionId: str
    customerInfo: dict
    paymentMethod: str = "qr_code"


class PaymentResponse(BaseModel):
    orderId: str
    qrCode: str  # Base64 encoded QR code
    amount: float
    currency: str = "Bs"
    status: str = "pending"


def generate_qr_code(order_id: str, amount: float) -> str:
    """Generate QR code for payment"""
    try:
        # Simulate payment QR with order info
        qr_data = f"TAMBAR_LIQUOR_PAYMENT:{order_id}:{amount}Bs"
        
        qr = qrcode.QRCode(
            version=1,
            error_correction=qrcode.constants.ERROR_CORRECT_L,
            box_size=10,
            border=4,
        )
        qr.add_data(qr_data)
        qr.make(fit=True)

        # Create QR code image
        qr_img = qr.make_image(fill_color="black", back_color="white")
        
        # Convert to base64
        buffer = BytesIO()
        qr_img.save(buffer, format='PNG')
        qr_base64 = base64.b64encode(buffer.getvalue()).decode()
        
        return f"data:image/png;base64,{qr_base64}"
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"QR generation error: {str(e)}")


@router.post("/create-order", response_model=PaymentResponse)
async def create_payment_order(payment_request: PaymentRequest, db = Depends(get_database)):
    """Create payment order and generate QR code"""
    try:
        # Get cart items
        cart = await db.carts.find_one({"sessionId": payment_request.sessionId})
        if not cart or not cart.get("items"):
            raise HTTPException(status_code=400, detail="Cart is empty")
        
        # Calculate total amount
        total_amount = 0
        for item in cart["items"]:
            total_amount += item["price"] * item["quantity"]
        
        # Generate order ID
        order_id = f"TAMBAR_{uuid.uuid4().hex[:8].upper()}"
        
        # Create order record
        order_data = {
            "orderId": order_id,
            "sessionId": payment_request.sessionId,
            "items": cart["items"],
            "customerInfo": payment_request.customerInfo,
            "totalAmount": total_amount,
            "currency": "Bs",
            "status": "pending",
            "paymentMethod": payment_request.paymentMethod,
            "createdAt": datetime.utcnow()
        }
        
        await db.orders.insert_one(order_data)
        
        # Generate QR code for payment
        qr_code = generate_qr_code(order_id, total_amount)
        
        return PaymentResponse(
            orderId=order_id,
            qrCode=qr_code,
            amount=total_amount,
            status="pending"
        )
        
    except Exception as e:
        if "Cart is empty" in str(e):
            raise e
        raise HTTPException(status_code=500, detail=f"Order creation error: {str(e)}")


@router.get("/order/{order_id}")
async def get_order_status(order_id: str, db = Depends(get_database)):
    """Get order status"""
    try:
        order = await db.orders.find_one({"orderId": order_id})
        if not order:
            raise HTTPException(status_code=404, detail="Order not found")
        
        return {
            "orderId": order["orderId"],
            "status": order["status"],
            "totalAmount": order["totalAmount"],
            "currency": order["currency"],
            "createdAt": order["createdAt"]
        }
        
    except Exception as e:
        if "Order not found" in str(e):
            raise e
        raise HTTPException(status_code=500, detail=f"Order status error: {str(e)}")


@router.post("/simulate-payment/{order_id}")
async def simulate_payment_success(order_id: str, db = Depends(get_database)):
    """Simulate successful payment (for demo purposes)"""
    try:
        order = await db.orders.find_one({"orderId": order_id})
        if not order:
            raise HTTPException(status_code=404, detail="Order not found")
        
        # Update order status to completed
        await db.orders.update_one(
            {"orderId": order_id},
            {
                "$set": {
                    "status": "completed",
                    "completedAt": datetime.utcnow()
                }
            }
        )
        
        # Clear the cart
        await db.carts.update_one(
            {"sessionId": order["sessionId"]},
            {"$set": {"items": []}}
        )
        
        return {
            "message": "Payment simulated successfully",
            "orderId": order_id,
            "status": "completed"
        }
        
    except Exception as e:
        if "Order not found" in str(e):
            raise e
        raise HTTPException(status_code=500, detail=f"Payment simulation error: {str(e)}")