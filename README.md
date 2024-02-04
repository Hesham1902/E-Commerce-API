# E-Commerce API Documentation

Welcome to the documentation for the E-Commerce API. This API provides endpoints to manage categories, sub-categories, brands, products, carts, reviews, users, coupons, and orders.

## Base URL

The base URL for all API endpoints is: `{{base_url}} ==> https://good-perch.cyclic.app`

## Authentication

To access certain routes, authentication is required. Obtain an access token by following the authentication process.

#### Signup (Enter your name, email, Password and confirmPassword in body)
- Endpoint: `{{base_url}}/api/v1/auth/signup`
- Method: POST
  
#### Login (Enter your email and password in body)
- Endpoint: `{{base_url}}/api/v1/auth/login`
- Method: POST

## Routes

### Categories

#### Get All Categories
- Endpoint: `{{base_url}}/api/v1/categories`
- Method: GET

#### Get Category by ID
- Endpoint: `{{base_url}}/api/v1/categories/:id`
- Method: GET

#### Create new Category
- Endpoint: `{{base_url}}/api/v1/categories`
- Method: POST

#### Update Category by ID
- Endpoint: `{{base_url}}/api/v1/categories/:id`
- Method: PUT

#### Delete Category by ID
- Endpoint: `{{base_url}}/api/v1/categories/:id`
- Method: DELETE
  
...


### Sub Categories

#### Get All SubCategories
- Endpoint: `{{base_url}}/api/v1/subcategories`
- Method: GET

#### Get SubCategories by ID
- Endpoint: `{{base_url}}/api/v1/subcategories/:id`
- Method: GET

#### Create new SubCategories
- Endpoint: `{{base_url}}/api/v1/subcategories`
- Method: POST

#### Update SubCategories by ID
- Endpoint: `{{base_url}}/api/v1/subcategories/:id`
- Method: PUT

#### Delete SubCategories by ID
- Endpoint: `{{base_url}}/api/v1/subcategories/:id`
- Method: DELETE
  
...


### Brands

#### Get All Brands
- Endpoint: `{{base_url}}/api/v1/brands`
- Method: GET

#### Get Brand by ID
- Endpoint: `{{base_url}}/api/v1/brands/:id`
- Method: GET

#### Create new Brand
- Endpoint: `{{base_url}}/api/v1/brands`
- Method: POST

#### Update Brand by ID
- Endpoint: `{{base_url}}/api/v1/brands/:id`
- Method: PUT

#### Delete Brand by ID
- Endpoint: `{{base_url}}/api/v1/brands/:id`
- Method: DELETE
  
...

### Products

#### Get All Products
- Endpoint: `{{base_url}}/api/v1/products`
- Method: GET

#### Get Product by ID
- Endpoint: `{{base_url}}/api/v1/products/:id`
- Method: GET

#### Create new Product
- Endpoint: `{{base_url}}/api/v1/products`
- Method: POST

#### Update Product by ID
- Endpoint: `{{base_url}}/api/v1/products/:id`
- Method: PUT

#### Delete Product by ID
- Endpoint: `{{base_url}}/api/v1/products/:id`
- Method: DELETE

...

### Carts

#### Adding product to cart by ID
- body: productId, color
- Endpoint: `{{base_url}}/api/v1/carts/:id`
- Method: POST

#### Delete specific item from cart items
- Endpoint: `{{base_url}}/api/v1/carts/:id`
- Method: DELETE

#### Apply coupon on cart
- body : { name: "Coupon Name" }
- Endpoint: `{{base_url}}/api/v1/carts/applyCoupon`
- Method: PUT

#### Get logged user cart
- Endpoint: `{{base_url}}/api/v1/carts`
- Method: GET

#### Update cart item quantity
- body: quantity
- Endpoint: `{{base_url}}/api/v1/carts/:id`
- Method: PUT

...

### Reviews

#### Get All Reviews
- Endpoint: `{{base_url}}/api/v1/reviews`
- Method: GET

#### Get Review by ID
- Endpoint: `{{base_url}}/api/v1/reviews/:id`
- Method: GET

#### Create new Review
- Endpoint: `{{base_url}}/api/v1/reviews`
- Method: POST

#### Update Review by ID
- Endpoint: `{{base_url}}/api/v1/reviews/:id`
- Method: PUT

#### Delete Review by ID
- Endpoint: `{{base_url}}/api/v1/reviews/:id`
- Method: DELETE
  
#### Nested Routes:

##### Get reviews for specific product 
- Endpoint: `{{base_url}}/api/v1/reviews/:id`
- Method: GET
  
##### Create reviews for specific product 
- Endpoint: `{{base_url}}/api/v1/products/:id/reviews`
- Method: GET
  
##### Create review for specific product 
- Endpoint: `{{base_url}}/api/v1/products/:id/reviews`
- Method: POST
  
##### Get specific review for a Specific product 
- Endpoint: `{{base_url}}/api/v1/products/:productid/reviews/:reviewId`
- Method: GET

...

### Users (Must be ADMIN or Manager)

#### Get All Users
- Endpoint: `{{base_url}}/api/v1/users`
- Method: GET

#### Get User by ID
- Endpoint: `{{base_url}}/api/v1/users/:id`
- Method: GET

#### Create new User
- Endpoint: `{{base_url}}/api/v1/users`
- Method: POST

#### Update User by ID
- Endpoint: `{{base_url}}/api/v1/users/:id`
- Method: PUT

#### Delete User by ID
- Endpoint: `{{base_url}}/api/v1/users/:id`
- Method: DELETE


...

### Coupons


...

### Orders

...

## Query Parameters

- **Search:** Use the `search` parameter for searching.
- **Filtering:** Apply filters using specific parameters.
- **Sorting:** Sort results using the `sort` parameter.
- **Pagination:** Control the number of results using the `page` and `limit` parameters.

## Example

```bash
curl -X GET {{base_url}}/api/products?search=Laptop&sort=price&limit=10&page=1
