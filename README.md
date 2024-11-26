# Northcoders News API

You will need to create two .env files for your project: .env.test and .env.development. Into each, add PGDATABASE=, with the correct database name for that environment (see /db/setup.sql for the database names). Double check that these .env files are .gitignored.

getAPI - This will retrieve all available endpoints on the API:

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

Get /api/articles

fetches articles data
returns an array of objects in descending order by date.

Used COALESCE to add default 0 to articles with no votes. Uses the second argument if first argument is null. Source: https://www.postgresql.org/docs/current/functions-conditional.html#FUNCTIONS-COALESCE-NVL-IFNULL

Used Count and a Join to the comments data to add in comment count, GROUP BY is paired with count to ensure one row per article.

Tests that it:
responds with an array of object containing the correct keys and in descending order.

Get /api/articles/:article_id

app updated with get for the above endpoint.

fetches a single article by id

error handling in the controller to handle 404 not found

tests that article has valid ID using .toBeDefined
test for 400 bad request
test that the article is received and is defined
tests that article is an object containing the correct keys

---

This portfolio project was created as part of a Digital Skills Bootcamp in Software Engineering provided by [Northcoders](https://northcoders.com/)
