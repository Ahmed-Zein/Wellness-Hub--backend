## Meal Schema

The `Meal` schema represents information about a meal offered by a seller.

### Fields:

- **seller**:

  - Type: `ObjectId`
  - Required: Yes
  - Description: References the seller who offers the meal. It is linked to the `Seller` model.

- **title**:

  - Type: `String`
  - Required: Yes
  - Description: The title of the meal.

- **images**:

  - Type: Array of `String`
  - Description: URLs of images associated with the meal.

- **description**:

  - Type: `String`
  - Required: Yes
  - Description: Description of the meal.

- **price**:

  - Type: `Number`
  - Required: Yes
  - Float: True
  - Description: Price of the meal.

- **tags**:

  - Type: Array of `String`
  - Description: Tags associated with the meal, helping in categorization or search.

- **review**:
  - Type: Array of Objects
  - Description: Reviews provided by customers for the meal.
  - Fields within the review object:
    - **customer**:
      - Type: `ObjectId`
      - Required: Yes
      - Description: References the customer who wrote the review. It is linked to the `Customer` model.
    - **content**:
      - Type: `String`
      - Required: Yes
      - Description: Content of the review.

### EndPoints

| id  | method | endpoint                         | descrition                      | protected | status |
| --- | ------ | -------------------------------- | ------------------------------- | --------- | ------ |
| 1   | GET    | /meals                           | Get a list of all meals.        | False     | [x]    |
| 2   | GET    | /meals/:mealId                   | Get details of a specific meal. | False     | [x]    |
| 3   | POST   | /meals                           | Create a new meal.              | True      | [x]    |
| 4   | PUT    | /meals/:mealId                   | Update a meal.                  | True      | [x]    |
| 5   | DELETE | /meals/:mealId                   | Delete a meal.                  | True      | [x]    |
| 6   | POST   | /meals/:mealId/reviews           | Add a review to a meal.         | True      | [x]    |
| 7   | PUT    | /meals/:mealId/reviews/:reviewId | Update a review of a meal.      | True      | [ ]    |
| 8   | DELETE | /meals/:mealId/reviews/:reviewId | Delete a review of a meal.      | True      | [ ]    |
| 9   | POST   | /meals/:mealId/rate              | Rate a meal. [TODO]             | True      | [ ]    |
