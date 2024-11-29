# Northcoders News API

You will need to create two .env files for your project: .env.test and .env.development. Into each, add PGDATABASE=, with the correct database name for that environment (see /db/setup.sql for the database names). Double check that these .env files are .gitignored.

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

##

This portfolio project was created as part of a Digital Skills Bootcamp in Software Engineering provided by [Northcoders](https://northcoders.com/)
