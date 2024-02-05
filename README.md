# E-Commerce API Documentation

Welcome to the documentation for the E-Commerce API. This API provides endpoints to manage categories, sub-categories, brands, products, carts, reviews, users, coupons, and orders.

# Table of Contents

- [Base URL](#base-url)
- [Authentication](#authentication)
  - [Signup](#signup)
  - [Login](#login)
  - [Forgot Password](#forgot-password)
  - [Verify Reset Code](#verify-reset-code)
  - [Reset Password](#reset-password)
- [Routes](#routes)
  - [Logged user](#logged-user)
    - [Get Logged User](#get-logged-user)
    - [Update Password](#update-password)
    - [Update Logged user data](#update-logged-user-data)
    - [Deactivate Logged User](#deactivate-logged-user)
    - [Activate Logged User](#activate-logged-user)
  - [Categories](#categories)
    - [Get All Categories](#get-all-categories)
    - [Get Category by ID](#get-category-by-id)
    - [Create new Category](#create-new-category)
    - [Update Category by ID](#update-category-by-id)
    - [Delete Category by ID](#delete-category-by-id)
      - [Nested Routes](#nested-routes)
        - [Get SubCategories for a Specific Category](#get-subcategories-for-a-specific-category)
        - [Create subCategory for specific category](#create-subcategory-for-specific-category)
  - [Sub Categories](#sub-categories)
    - [Get All SubCategories](#get-all-subcategories)
    - [Get SubCategories by ID](#get-subcategories-by-id)
    - [Create new SubCategories](#create-new-subcategories)
    - [Update SubCategories by ID](#update-subcategories-by-id)
    - [Delete SubCategories by ID](#delete-subcategories-by-id)
   
...

## Base URL

The base URL for all API endpoints is: `{{base_url}} ==> https://good-perch.cyclic.app`

## Authentication

To access certain routes, authentication is required. Obtain an access token by following the authentication process.

#### Signup
- body: name,email,Password,confirmPassword
- Endpoint: `{{base_url}}/api/v1/auth/signup`
- Method: POST
  
#### Login
- body: email,Password
- Endpoint: `{{base_url}}/api/v1/auth/login`
- Method: POST
- 
#### Forgot Password
- body: email
- Endpoint: `{{base_url}}/api/v1/auth/forgotPassword`
- Method: POST

#### Verify Reset Code
- body: resetCode
- Endpoint: `{{base_url}}/api/v1/auth/verifyResetCode`
- Method: POST

#### Reset password
- body: email,newPassword
- Endpoint: `{{base_url}}/api/v1/auth/resetPassword`
- Method: PUT


## Routes

### Logged user

#### Get Logged User
- Endpoint: `{{base_url}}/api/v1/users/getMe`
- Method: GET

#### Update Password
- body: currentPassword,password,confirmNewPassword
- Endpoint: `{{base_url}}/api/v1/users/changeMyPassword`
- Method: PUT

#### Update Logged user data
- body: name,email,phone
- Endpoint: `{{base_url}}/api/v1/users/updateMe`
- Method: PUT

#### Deactivate Logged User
- Endpoint: `{{base_url}}/api/v1/users/deactivateMe`
- Method: DETETE

#### activate Logged User
- Endpoint: `{{base_url}}/api/v1/users/activateMe`
- Method: PUT

...

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
  
  #### Nested Routes:

##### Get SubCategories for a Specific Category 
- Endpoint: `{{base_url}}/api/v1/categories/:categoryId/subcategories`
- Method: GET
  
##### Create subCategory for specific category 
- Endpoint: `{{base_url}}/api/v1/categories/:categoryId/subcategories`
- Method: POST

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

### Carts  (Must be logged)

#### Adding product to cart
- body: productId, color
- Endpoint: `{{base_url}}/api/v1/carts/:id`
- Method: POST

#### Delete specific item from cart items
- Endpoint: `{{base_url}}/api/v1/carts/:id`
- Method: DELETE

#### Clear cart for logged user
- Endpoint: `{{base_url}}/api/v1/carts`
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

#### Update user password with data
- body: currentPassword,password,confirmNewPassword
- Endpoint: `{{base_url}}/api/v1/users/changePassword/:id`
- Method: PUT


#### update logged user data (can accessed by user)
- body: name,email,phone
- Endpoint: `{{base_url}}/api/v1/users/updateMe`
- Method: PUT

#### Delete User by ID
- Endpoint: `{{base_url}}/api/v1/users/:id`
- Method: DELETE

...

### Coupons

#### Get All Coupons
- Endpoint: `{{base_url}}/api/v1/coupons`
- Method: GET

#### Get Coupon by ID
- Endpoint: `{{base_url}}/api/v1/coupons/:id`
- Method: GET

#### Create new Coupon
- Endpoint: `{{base_url}}/api/v1/coupons`
- Method: POST

#### Update Coupon by ID
- Endpoint: `{{base_url}}/api/v1/coupons/:id`
- Method: PUT

#### Delete Coupon by ID
- Endpoint: `{{base_url}}/api/v1/coupons/:id`
- Method: DELETE

...

### Wishlist

#### Add product to wishlist
- body: productId
- Endpoint: `{{base_url}}/api/v1/wishlist`
- Method: POST

#### Get Logged user wishlist
- Endpoint: `{{base_url}}/api/v1/wishlist`
- Method: GET

#### Remove product from wishlist
- Endpoint: `{{base_url}}/api/v1/wishlist/:id`
- Method: DELETE

...

### Orders

#### Create cash order
- body: shippingAddress
- Endpoint: `{{base_url}}/api/v1/orders/:cartId`
- Method: POST

#### Get All orders for logged User
- Endpoint: `{{base_url}}/api/v1/orders`
- Method: GET

#### Get specific order by Id (must be yours)
- Endpoint: `{{base_url}}/api/v1/orders/:orderId`
- Method: GET  

#### Get checkout session for card payment
- Endpoint: `{{base_url}}/api/v1/orders/checkout-session/cartId`
- Method: GET

#### update paid status (Admin)
- Endpoint: `{{base_url}}/api/v1/orders/orderId/pay`
- Method: PUT

#### update deliver status (Admin)
- Endpoint: `{{base_url}}/api/v1/orders/orderId/deliver`
- Method: PUT

...

### Addresses

#### Add Address
- body: alias,details,phone,city,postalCode
- Endpoint: `{{base_url}}/api/v1/addresses`
- Method: POST

#### Update Address
- body: alias,details,phone,city,postalCode
- Endpoint: `{{base_url}}/api/v1/addresses/:addressId`
- Method: PUT

  #### Remove address from addresses list
- Endpoint: `{{base_url}}/api/v1/addresses/:addressId`
- Method: DELETE

  #### Get Logged user addresses
- Endpoint: `{{base_url}}/api/v1/addresses`
- Method: GET

...


## Query Parameters

- **Search:** Use the `search` parameter for searching.
- **Filtering:** Apply filters using specific parameters.
- **Sorting:** Sort results using the `sort` parameter.
- **Pagination:** Control the number of results using the `page` and `limit` parameters.

## Example

```bash
curl -X GET {{base_url}}/api/products?search=Laptop&sort=price&limit=10&page=1
