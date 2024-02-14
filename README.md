<div align="center">
  <h1>E-Commerce API Documentation</h1>
  <p>Welcome to the documentation for the E-Commerce API. This API provides endpoints to manage categories, sub-categories, brands, products, carts, reviews, users, coupons, and orders.
.</p>
      <img src="https://img.shields.io/badge/Node%20js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="nodejs" />
      <img src="https://img.shields.io/badge/Express%20js-000000?style=for-the-badge&logo=express&logoColor=white" alt="express" />
      <img src="https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white" alt="mongodb" />
      <img src="https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=JSON%20web%20tokens&logoColor=white" alt="jwt">
  </div>

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
  - [Brands](#brands)
    - [Get All Brands](#get-all-brands)
    - [Get Brand by ID](#get-brand-by-id)
    - [Create new Brand](#create-new-brand)
    - [Update Brand by ID](#update-brand-by-id)
    - [Delete Brand by ID](#delete-brand-by-id)
  - [Products](#products)
    - [Get All Products](#get-all-products)
    - [Get Product by ID](#get-product-by-id)
    - [Create new Product](#create-new-product)
    - [Update Product by ID](#update-product-by-id)
    - [Delete Product by ID](#delete-product-by-id)
  - [Carts (Must be logged)](#carts-must-be-logged)
    - [Adding product to cart](#adding-product-to-cart)
    - [Delete specific item from cart items](#delete-specific-item-from-cart-items)
    - [Clear cart for logged user](#clear-cart-for-logged-user)
    - [Apply coupon on cart](#apply-coupon-on-cart)
    - [Get logged user cart](#get-logged-user-cart)
    - [Update cart item quantity](#update-cart-item-quantity)
  - [Reviews](#reviews)
    - [Get All Reviews](#get-all-reviews)
    - [Get Review by ID](#get-review-by-id)
    - [Create new Review](#create-new-review)
    - [Update Review by ID](#update-review-by-id)
    - [Delete Review by ID](#delete-review-by-id)
      - [Nested Routes](#nested-routes-1)
        - [Get reviews for specific product](#get-reviews-for-specific-product)
        - [Create reviews for specific product](#create-reviews-for-specific-product)
        - [Create review for specific product](#create-review-for-specific-product)
        - [Get specific review for a Specific product](#get-specific-review-for-a-specific-product)
  - [Users (Must be ADMIN or Manager)](#users-must-be-admin-or-manager)
    - [Get All Users](#get-all-users)
    - [Get User by ID](#get-user-by-id)
    - [Create new User](#create-new-user)
    - [Update User by ID](#update-user-by-id)
    - [Update user password with data](#update-user-password-with-data)
    - [Update logged user data (can be accessed by user)](#update-logged-user-data-can-be-accessed-by-user)
    - [Delete User by ID](#delete-user-by-id)
  - [Coupons](#coupons)
    - [Get All Coupons](#get-all-coupons)
    - [Get Coupon by ID](#get-coupon-by-id)
    - [Create new Coupon](#create-new-coupon)
    - [Update Coupon by ID](#update-coupon-by-id)
    - [Delete Coupon by ID](#delete-coupon-by-id)
  - [Wishlist](#wishlist)
    - [Add product to wishlist](#add-product-to-wishlist)
    - [Get Logged user wishlist](#get-logged-user-wishlist)
    - [Remove product from wishlist](#remove-product-from-wishlist)
  - [Orders](#orders)
    - [Create cash order](#create-cash-order)
    - [Get All orders for logged User](#get-all-orders-for-logged-user)
    - [Get specific order by Id (must be yours)](#get-specific-order-by-id-must-be-yours)
    - [Get checkout session for card payment](#get-checkout-session-for-card-payment)
    - [Update paid status (Admin)](#update-paid-status-admin)
    - [Update deliver status (Admin)](#update-deliver-status-admin)
  - [Addresses](#addresses)
    - [Add Address](#add-address)
    - [Update Address](#update-address)
    - [Remove address from addresses list](#remove-address-from-addresses-list)
    - [Get Logged user addresses](#get-logged-user-addresses)
  - [Query Parameters](#query-parameters)
  - [Example](#example)

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
