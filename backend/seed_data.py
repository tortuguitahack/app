import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
import os
from dotenv import load_dotenv
from pathlib import Path

# Load environment variables
ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# Mock data to seed
MOCK_PRODUCTS = [
    {
        "id": "1",
        "name": "Jack Daniel's Single Barrel",
        "category": "whiskey",
        "brand": "Jack Daniel's",
        "price": 180.0,
        "description": "Premium single barrel Tennessee whiskey with exceptional depth and character. Aged to perfection with notes of vanilla, caramel, and oak.",
        "image": "https://images.unsplash.com/photo-1746422029293-43065303dab5?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzl8MHwxfHNlYXJjaHwyfHxsdXh1cnklMjB3aGlza2V5fGVufDB8fHx8MTc1NzgzNTE2NXww&ixlib=rb-4.1.0&q=85",
        "inStock": True,
        "featured": True,
        "alcohol": 43.0,
        "inventory": 50
    },
    {
        "id": "2",
        "name": "Glenfiddich 15 Year",
        "category": "whiskey",
        "brand": "Glenfiddich",
        "price": 220.0,
        "description": "Sophisticated single malt Scotch whiskey aged 15 years. Rich, warm, and spicy with hints of honey and vanilla from solera maturation.",
        "image": "https://images.unsplash.com/photo-1746422029200-51af8d27a0da?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzl8MHwxfHNlYXJjaHwzfHxsdXh1cnklMjB3aGlza2V5fGVufDB8fHx8MTc1NzgzNTE2NXww&ixlib=rb-4.1.0&q=85",
        "inStock": True,
        "featured": True,
        "alcohol": 40.0,
        "inventory": 30
    },
    {
        "id": "3",
        "name": "Jack Daniel's Old No. 7",
        "category": "whiskey",
        "brand": "Jack Daniel's",
        "price": 65.0,
        "description": "Classic Tennessee whiskey with smooth, mellow taste. Charcoal mellowed and aged in new oak barrels for distinctive flavor.",
        "image": "https://images.unsplash.com/photo-1618513033174-cfe319656ea6?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODB8MHwxfHNlYXJjaHwxfHx3aGlza2V5JTIwYm90dGxlc3xlbnwwfHx8fDE3NTc4MzUxNzV8MA&ixlib=rb-4.1.0&q=85",
        "inStock": True,
        "featured": False,
        "alcohol": 40.0,
        "inventory": 100
    },
    {
        "id": "4",
        "name": "Woodford Reserve",
        "category": "whiskey",
        "brand": "Woodford Reserve",
        "price": 95.0,
        "description": "Premium Kentucky bourbon whiskey with rich, complex flavors. Notes of spice, wood, and sweet aromatics create an exceptional drinking experience.",
        "image": "https://images.unsplash.com/photo-1653834724695-96065e0268d6?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODB8MHwxfHNlYXJjaHwyfHx3aGlza2V5JTIwYm90dGxlc3xlbnwwfHx8fDE3NTc4MzUxNzV8MA&ixlib=rb-4.1.0&q=85",
        "inStock": True,
        "featured": False,
        "alcohol": 45.2,
        "inventory": 75
    },
    {
        "id": "5",
        "name": "Dom Pérignon Vintage",
        "category": "champagne",
        "brand": "Dom Pérignon",
        "price": 350.0,
        "description": "Legendary champagne with exceptional elegance. Complex aromatic bouquet with floral notes and minerality that defines luxury.",
        "image": "https://images.unsplash.com/photo-1749841730928-8d8fd288d982?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzV8MHwxfHNlYXJjaHwzfHxsdXh1cnklMjBjaGFtcGFnbmV8ZW58MHx8fHwxNzU3ODM1MjE0fDA&ixlib=rb-4.1.0&q=85",
        "inStock": True,
        "featured": True,
        "alcohol": 12.5,
        "inventory": 25
    },
    {
        "id": "6",
        "name": "Krug Grande Cuvée",
        "category": "champagne",
        "brand": "Krug",
        "price": 280.0,
        "description": "Prestigious champagne crafted from over 120 wines. Full-bodied with remarkable depth, complexity, and finesse that epitomizes luxury.",
        "image": "https://images.pexels.com/photos/2995333/pexels-photo-2995333.jpeg",
        "inStock": True,
        "featured": True,
        "alcohol": 12.0,
        "inventory": 40
    },
    {
        "id": "7",
        "name": "Château Margaux 2015",
        "category": "wine",
        "brand": "Château Margaux",
        "price": 1200.0,
        "description": "Exceptional Bordeaux wine from one of France's most prestigious estates. Complex, elegant, and perfectly balanced with extraordinary aging potential.",
        "image": "https://images.unsplash.com/photo-1695634580128-dd3cf126dabf?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzl8MHwxfHNlYXJjaHwyfHx3aW5lJTIwY2hhbXBhZ25lJTIwYm90dGxlc3xlbnwwfHx8fDE3NTc4MzUyMDV8MA&ixlib=rb-4.1.0&q=85",
        "inStock": True,
        "featured": True,
        "alcohol": 13.5,
        "inventory": 15
    },
    {
        "id": "8",
        "name": "Opus One 2018",
        "category": "wine",
        "brand": "Opus One",
        "price": 450.0,
        "description": "Iconic Napa Valley wine representing the marriage of French winemaking tradition and California innovation. Rich, complex, and supremely elegant.",
        "image": "https://images.unsplash.com/photo-1749983030057-801e003ad976?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzV8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBjaGFtcGFnbmV8ZW58MHx8fHwxNzU3ODM1MjE0fDA&ixlib=rb-4.1.0&q=85",
        "inStock": False,
        "featured": False,
        "alcohol": 14.5,
        "inventory": 0
    }
]

MOCK_CATEGORIES = [
    {
        "id": "whiskey",
        "name": "Whiskey",
        "description": "Premium whiskeys from around the world",
        "image": "https://images.unsplash.com/photo-1582819509237-d5b75f20ff7a?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzl8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjB3aGlza2V5fGVufDB8fHx8MTc1NzgzNTE2NXww&ixlib=rb-4.1.0&q=85"
    },
    {
        "id": "wine",
        "name": "Wine",
        "description": "Exceptional wines from renowned estates",
        "image": "https://images.unsplash.com/photo-1695634580128-dd3cf126dabf?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzl8MHwxfHNlYXJjaHwyfHx3aW5lJTIwY2hhbXBhZ25lJTIwYm90dGxlc3xlbnwwfHx8fDE3NTc4MzUyMDV8MA&ixlib=rb-4.1.0&q=85"
    },
    {
        "id": "champagne",
        "name": "Champagne",
        "description": "Luxury champagnes for special occasions",
        "image": "https://images.pexels.com/photos/2995333/pexels-photo-2995333.jpeg"
    }
]


async def seed_database():
    """Seed the database with initial data"""
    try:
        # Connect to MongoDB
        mongo_url = os.environ['MONGO_URL']
        client = AsyncIOMotorClient(mongo_url)
        db = client[os.environ['DB_NAME']]
        
        print("🌱 Starting database seeding...")
        
        # Clear existing data
        await db.products.delete_many({})
        await db.categories.delete_many({})
        print("🗑️  Cleared existing data")
        
        # Seed categories
        for category_data in MOCK_CATEGORIES:
            await db.categories.insert_one(category_data)
        print(f"✅ Seeded {len(MOCK_CATEGORIES)} categories")
        
        # Seed products
        for product_data in MOCK_PRODUCTS:
            await db.products.insert_one(product_data)
        print(f"✅ Seeded {len(MOCK_PRODUCTS)} products")
        
        # Verify data
        product_count = await db.products.count_documents({})
        category_count = await db.categories.count_documents({})
        
        print(f"🎯 Database seeding completed!")
        print(f"   - Products: {product_count}")
        print(f"   - Categories: {category_count}")
        
        client.close()
        
    except Exception as e:
        print(f"❌ Error seeding database: {e}")


if __name__ == "__main__":
    asyncio.run(seed_database())