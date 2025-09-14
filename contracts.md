# Elite Liquor Store - Backend Integration Contracts

## API Endpoints Needed

### Products API
- `GET /api/products` - Get all products with optional filters
  - Query params: `category`, `search`, `featured`, `inStock`
- `GET /api/products/:id` - Get single product by ID
- `POST /api/products` - Create new product (admin)
- `PUT /api/products/:id` - Update product (admin)
- `DELETE /api/products/:id` - Delete product (admin)

### Categories API
- `GET /api/categories` - Get all categories with product counts
- `POST /api/categories` - Create new category (admin)

### Cart API
- `GET /api/cart/:sessionId` - Get cart items for session
- `POST /api/cart/:sessionId/items` - Add item to cart
- `PUT /api/cart/:sessionId/items/:productId` - Update item quantity
- `DELETE /api/cart/:sessionId/items/:productId` - Remove item from cart
- `DELETE /api/cart/:sessionId` - Clear cart

### Age Verification API
- `POST /api/age-verify` - Store age verification status

## Database Models

### Product Model
```javascript
{
  _id: ObjectId,
  name: String,
  category: String, // 'whiskey', 'wine', 'champagne'
  brand: String,
  price: Number,
  description: String,
  image: String, // URL to image
  inStock: Boolean,
  featured: Boolean,
  alcohol: Number, // ABV percentage
  inventory: Number, // Stock quantity
  createdAt: Date,
  updatedAt: Date
}
```

### Category Model
```javascript
{
  _id: ObjectId,
  id: String, // 'whiskey', 'wine', 'champagne'
  name: String,
  description: String,
  image: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Cart Model
```javascript
{
  _id: ObjectId,
  sessionId: String,
  items: [{
    productId: String,
    name: String,
    price: Number,
    image: String,
    quantity: Number,
    addedAt: Date
  }],
  createdAt: Date,
  updatedAt: Date
}
```

## Frontend Integration Changes

### Remove Mock Data Usage
- Remove imports from `./data/mock.js`
- Replace mock data calls with API calls using axios

### API Integration Points
1. **App.js**: Replace `mockProducts`, `mockCategories` with API calls
2. **ProductGrid.jsx**: Fetch products via API with category filtering
3. **SearchModal.jsx**: Implement real-time search via API
4. **Cart functionality**: Implement persistent cart with session management

### State Management Updates
- Implement loading states for API calls
- Add error handling for failed requests
- Add success notifications for cart operations

### Session Management
- Generate unique session ID for cart functionality
- Store session ID in localStorage
- Pass session ID to all cart API calls

## Environment Variables
- Backend already has MONGO_URL configured
- Frontend already has REACT_APP_BACKEND_URL configured

## Implementation Priority
1. Products CRUD API with seeding of mock data
2. Categories API
3. Cart API with session management
4. Frontend integration replacing mock data
5. Error handling and loading states
6. Testing and validation

## Mock Data Migration
Current mock data in `/app/frontend/src/data/mock.js` will be:
- Migrated to MongoDB via seeding script
- Replaced with API calls in components
- Used as reference for data structure validation