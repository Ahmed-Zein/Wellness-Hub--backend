# Endpoints

## POST `customer/register`

### Description

This endpoint handles the customer sign-up process. It validates the request, checks if the user already exists, hashes the password, creates a new customer record, saves it to the database, and returns tokens upon successful registration.

## Request Body

The `req.body` should contain the following fields:

- **name** (String): The name of the customer.
- **email** (String): The email address of the customer. This will be used to check if the user already exists.
- **password** (String): The plain text password, which will be hashed before saving.
- **phone** (String): The phone number of the customer.
- **address** (String): The physical address of the customer.

## Response

On successful registration, the response will have a status code of 201 and the following JSON.
payload:

```json
{
  "message": "success",
  "userId": "string",
  "accessToken": "string",
  "refreshToken": "string"
}
```

## Error Handling

Errors are thrown in specific cases:

- If the user already exists, a CustomError with the message "user already exists", AuthError, and status code `409` is thrown.
- If there is an issue with password hashing, a CustomError with the message "something went wrong", ServerError, and status code `500` is thrown.

## GET `/customer/:userId`

### Description

This endpoint retrieves the data of a customer by their user ID. It fetches the customer details from the database and returns them in the response.

### Parameters

- **userId** (String): The ID of the customer whose data is being requested. This should be included in the URL path.

### Response

On successful retrieval of customer data, the response will have a status code of `200` and the following JSON payload:

```json
{
  "name": "string",
  "email": "string",
  "phone": "string",
  "address": "string",
  "following": "number"
}
```

### Error Handling

Errors are handled in the following cases:

- If the customer with the given user ID is not found, an error message "user id not found" is sent, and a response with status code 404 is sent.
- Any other errors encountered during the database operation are logged, and a response with status code 404 and the error message is sent.

## POST `/customer/:userId/wishlist/:productId`

### Description

This endpoint allows a customer to add a product to their wishlist. It validates the request, checks if the customer and product exist, ensures the product is not already in the wishlist, adds the product to the wishlist, and returns a success message upon successful addition.

### Parameters

- **userId** (String): The ID of the customer whose wishlist is being updated. This should be included in the URL path.
- **productId** (String): The ID of the product being added to the wishlist. This should be included in the URL path.

### Response

On successful addition to the wishlist, the response will have a status code of 200.

### Error Handling

Errors are handled in the following cases:

- If the customer with the given user ID is not found, an error message "customer not found" is thrown and handled with status code 404.
- If the product is already in the customer's wishlist, an error message "the item is already in the wishlist" is thrown and handled with status code 409.
- If the product with the given product ID is not found in either the Product or Meal collections, an error message "item id not found" is thrown and handled with status code 404.
