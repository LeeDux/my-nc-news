# Northcoders News API

This project is a RESTful API designed to interact with articles, comments, topics, and users. It provides endpoints to retrieve, add, update, and delete data, with built-in error handling and validation mechanisms to ensure data integrity and smooth operation.

The API supports the following resources:

    Articles: Retrieve, update, and delete articles, as well as manage article votes and comments.
    Topics: Fetch and filter articles by specific topics.
    Comments: Add, retrieve, and delete comments related to articles.
    Users: Access a list of all users in the system.

The API also includes advanced features such as sorting, filtering, and comprehensive error handling, including custom error codes for common issues like invalid data and missing resources.

This project is part of a Software Engineering bootcamp portfolio at Northcoders.

1. getAPI - This will retrieve all available endpoints on the API:

- api/topics
  -api/articles

example response:
"topics": [{ "slug": "football", "description": "Footie!" }]

getTopics(controller)
selectTopics(model)

Responds with: an array of topic objects, each of which should have the following properties:
slug
description

testing getTopics
checks that getTopics responds with an array containing the topics data
checks the correct key values (slug, decsription) are present
responds with 404 if the topic does not exist.

Updated global error handler in the app.js file to handle:
22P02 - invalid syntax
400 - Bad Request
404 - Not Found
500 - Internal Server Error.

Updated middleware in the controller to pass error to the global error handler.

Added catch all route handler to app.js to catch invalid path. (source: https://www.geeksforgeeks.org/how-to-redirect-404-errors-to-a-page-in-express-js/)

2. Get /api/articles

fetches articles data
returns an array of objects in descending order by date.

Used COALESCE to add default 0 to articles with no votes. Uses the second argument if first argument is null. Source: https://www.postgresql.org/docs/current/functions-conditional.html#FUNCTIONS-COALESCE-NVL-IFNULL

Used Count and a Join to the comments data to add in comment count, GROUP BY is paired with count to ensure one row per article.

Tests that it:
responds with an array of object containing the correct keys and in descending order.

3. Get /api/articles/:article_id

app updated with get for the above endpoint.

fetches a single article by id

error handling in the controller to handle 404 not found

tests that article has valid ID using .toBeDefined
test for 400 bad request
test that the article is received and is defined
tests that article is an object containing the correct keys

4. Get /api/articles/:article_id/comments

model: selectComments takse article_id as its argument to find comments for the relevant article. It uses sqlQuery to select keys from comments and orders in descending order.

controller: getComments selects comments by invoking the selecComments function with the req param of article_id. Has error handling to return 404 if no comments found. The comments are sent as array under the key of comments in the response body.

error handling in the controller getComments function and in the app with app.use

test that the comments relating to the article_id are all recieved and in descending order.
tests that comments is an array of objects containing the correct keys.

5. POST /api/articles/:article_id/comments

endpoint added to app.js file

model updated with the following functions:
checkArticleExists checks article data to make sure article exists, else rejects with 404
checkUserExists - checks user data to make sure user exists, else rejects with 404
addCommentToDataBase - uses sql query to add comment
validation added in controller with isValid function to check article_id is a number. Added to getArticle_iD and getComment_iD

validation added to selectArticle function in the model to verify valid article_id.

The above functions will be envoked by addComment function

Tests that a new comment will be added and tests the return of an object containing the correct keys.
Tests for 404 error if a non existent user tries to post
Test for 404 error if article does not exist

6. PATCH /api/articles/:article_id

endpoint added to app.js

updateVotes function added to the articles.model.js file.
updateVotes: which accepts article_id and inc_votes (the value to increment/decrement the votes by).
It updates the votes in the articles table and returns the updated article.
If the article with the given article_id is not found, it throws a 404 error with a custom message.

patchVotes function added to api.controller.js file.
Request Body Validation: We check if inc_votes is a valid number. If not, we return a 400 Bad Request error with a message indicating that the request body is invalid.
Update Article: We call the updateVotes function from the articles model to update the article's votes and return the updated article.
Error Handling: Any errors (e.g., article not found) are passed to the error handler.

Tests:
Increment & decrement votes - sends patch request to check the votes increment an decrement correctly.

Invalid (non-numeric) - test that the vote type is integer

Article not found - checks the article exists

Checks for missing inc_votes from the response body

7. DELETE "/api/comments/:comment_id"

deleteComment added to the api.comments.model.js file
Uses SQL query and relevent comment id as the req params. if invalid comment id it will reject the promise.

deleteCommentByID added to the api.controller.js file
takse comment_id as req.params and calls the dekete comment function in the model. responds with a status code of 204 No Content on successful deletion

test
Deleting an existing comment (status 204).
Trying to delete a comment that does not exist (status 404).
Trying to delete a comment with an invalid comment_id format (status 400).

8. getUsers "/api/users"
   Description:
   This endpoint serves a list of all users in the system.

Response:
The response will be an array of user objects, each object containing the following properties:

    username: The username of the user (string)
    name: The name of the user (string)
    avatar_url: The URL of the user's avatar image (string)

Tests
test for correct response
returns 404 Not Found: If the users are not available or cannot be fetched from the database.
500 Internal Server Error: If there is an issue with the server or database connection.

9. -Feature request for "/api/articles"

Controller Updates:

    Added functionality to handle the sort_by and order query parameters in the /api/articles endpoint.
    sort_by: Allows the user to specify a column by which the articles should be sorted (e.g., title, created_at, votes). Defaults to created_at.
    order: Allows the user to specify the sort order, either asc (ascending) or desc (descending). Defaults to desc.
    If the sort_by or order parameters are invalid, the controller returns a 400 status code with an appropriate error message.

Model Updates:

    Updated the selectAllArticles function to dynamically adjust the SQL query based on the sort_by and order parameters.
    If no parameters are provided, the query defaults to sorting articles by created_at in descending order.
    If valid parameters are provided, the query sorts the articles accordingly (e.g., by title or votes).

tests:
Test for sorting by title in ascending order: Checks if the articles are sorted alphabetically by title.
Test for invalid query parameters: Ensures that invalid sort_by or order values return a 400 error with the correct error message.
Test for default sorting: Ensures that when no sort_by or order is provided, the articles are sorted by created_at in descending order.

10. Feature update
    Filtering Articles by Topic:

        Added a topic query parameter to filter articles by their topic.
        If the topic query is provided, only articles with the matching topic will be returned.
        If no topic query is provided, all articles are returned.

        tests articles can be filtered by topic and returns

##

This portfolio project was created as part of a Digital Skills Bootcamp in Software Engineering provided by [Northcoders](https://northcoders.com/)
