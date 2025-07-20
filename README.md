# 🛍️ Product Catalog API

# LINK TO MY VIDEO ON YOUTUBE

https://www.youtube.com/watch?v=l9glh6fZ3-w&ab_channel=Khaalidawyuusuf

A RESTful API for managing products, categories, and inventory reports with MongoDB and Swagger documentation.



## Table of Contents
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Setup & Installation](#-setup--installation)
- [API Documentation](#-api-documentation)
- [Endpoints](#-endpoints)
  - [Products](#-products)
  - [Categories](#-categories)
  - [Reports](#-reports)
- [Project Structure](#-project-structure)
- [Assumptions & Limitations](#-assumptions--limitations)

## 🚀 Features

- **CRUD Operations** for Products and Categories
- **Inventory Reports**:
  - Low stock alerts
  - High stock overview
- **Database**: MongoDB with Mongoose ODM
- **API Documentation**: Interactive Swagger UI

## 🧰 Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **ODM**: Mongoose
- **Documentation**: Swagger UI

## 📦 Setup & Installation

### Prerequisites
- Node.js (v14+)
- MongoDB (local or Atlas URI)
- npm/yarn

### Installation Steps
1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/product-catalog-api.git
   cd product-catalog-api

2. nstall dependencies:
   ```bash
    npm install

3. Configure environment:
    ``` bash
    Create .env file:
    PORT=5000
    MONGODB_URI=mongodb://localhost:27017/product-catalog

4. Start the server:
    ```bash
    npm start
    # or for development with nodemon
    nodemon api.js


## 📘 API Documentation
Interactive Swagger documentation is available at:
👉 http://localhost:5000/api-docs

## 📌 Endpoints

### 🛍️ Products

| Method | Endpoint             | Description         |
|--------|----------------------|---------------------|
| POST   | `/api/products`      | Create new product  |
| GET    | `/api/products`      | Get all products    |
| GET    | `/api/products/:id`  | Get single product  |
| PUT    | `/api/products/:id`  | Update product      |
| DELETE | `/api/products/:id`  | Delete product      |

Example Request (Create Product):
```bash
{
  "name": "Premium Laptop",
  "price": 1299.99,
  "category": "64b1234567890abc12345678",
  "stock": 15,
  "description": "High-performance laptop with 16GB RAM"
}

### 🗂️ Categories

| Method | Endpoint               | Description           |
|--------|------------------------|-----------------------|
| POST   | `/api/categories`      | Create new category   |
| GET    | `/api/categories`      | Get all categories    |
| GET    | `/api/categories/:id`  | Get single category   |
| PUT    | `/api/categories/:id`  | Update category       |
| DELETE | `/api/categories/:id`  | Delete category       |


Example Request (Create Category):
```bash 
{
  "name": "Electronics",
  "description": "Devices and gadgets"
}

### 📊 Reports

| Method | Endpoint                   | Description                      |
|--------|----------------------------|----------------------------------|
| GET    | `/api/products/reports/low-stock`   | Get products with low inventory  |
| GET    | `/api/products/reports/high-stock`  | Get products with high inventory |

Low Stock Response Example:

{
  "threshold": 10,
  "count": 5,
  "products": [
    {
      "name": "Wireless Mouse",
      "stock": 3,
      "price": 24.99
    }
  ]
}

product-catalog-api/
├── config/            # Database configuration
│   └── db.js
├── controllers/       # Business logic
│   ├── productController.js
│   ├── categoryController.js
│   └── reportController.js
├── models/            # MongoDB schemas
│   ├── Product.js
│   └── Category.js
├── routes/            # API routes
│   ├── productRoutes.js
│   ├── categoryRoutes.js
│   └── reportRoutes.js
├── middlewares/       # Custom middleware
├── swagger/           # API documentation
│   └── swagger.json
├── app.js             # Express application setup
├── server.js          # Server initialization
└── README.md          # Project documentation

 Assumptions & Limitations
Authentication: No user authentication implemented

Authorization: All endpoints are publicly accessible

Validation: Basic input validation only

Pagination: Product listings don't support pagination

Environment: Swagger UI only available in development mode