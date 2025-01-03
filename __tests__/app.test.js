const endpointsJson = require("../endpoints.json");
/* Set up your test imports here */
const request = require("supertest");
const app = require("../db/app.js");
const db = require("../db/connection"); //look here
const testData = require("../db/data/test-data");
const seed = require("../db/seeds/seed");
const articles = require("../db/data/test-data/articles.js");

/* Set up your beforeEach & afterAll functions here */

beforeEach(() => {
  return seed(testData);
});

afterAll(() => {
  return db.end();
});

describe("GET /api", () => {
  test("200: Responds with an object detailing the documentation for each endpoint", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body }) => {
        const { endpoint } = body;
        expect(endpoint).toEqual(endpointsJson);
      });
  });
});

describe("GET /api/topics", () => {
  test("200: Responds with an object detailing the topics data", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body }) => {
        console.log(body);
        const { topics } = body;
        expect(Array.isArray(topics)).toBe(true);
        topics.forEach((topic) => {
          expect(topic).toMatchObject({
            slug: expect.any(String),
            description: expect.any(String),
          });
        });
      });
  });
  test("404: should get error 404 if invalid input", () => {
    return request(app)
      .get("/api/doesnotexist")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not Found");
      });
  });
});

describe("Get /api/articles/:article_id", () => {
  test("status 200: accepts a query to return only articles with that article id", () => {
    return request(app)
      .get("/api/articles/2")
      .expect(200)
      .then(({ body }) => {
        const { article } = body;
        expect(article).toBeDefined();
        expect(article.article_id).toBe(2);
        expect(article).toMatchObject({
          article_id: expect.any(Number),
          title: expect.any(String),
          topic: expect.any(String),
          author: expect.any(String),
          body: expect.any(String),
          created_at: expect.any(String),
          votes: expect.any(Number),
          article_img_url: expect.any(String),
        });
      });
  });
  test("404: should return 404 if article not found", () => {
    return request(app)
      .get("/api/articles/2024")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Article not found");
      });
  });
});

describe("/api/articles", () => {
  test("200: should respond with all articles in descending order", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(Array.isArray(articles)).toBe(true);
        expect(articles).toHaveLength(testData.articleData.length);
        articles.forEach((article) => {
          expect(article).toHaveProperty("title");
          expect(article).toHaveProperty("topic");
          expect(article).toHaveProperty("author");
          expect(article).toHaveProperty("created_at");
          expect(article).toHaveProperty("votes");
          expect(article.votes).toBeDefined();
          expect(article).toHaveProperty("comment_count");
          expect(article).toHaveProperty("article_img_url");
        });
        for (let i = 0; i < articles.length - 1; i++) {
          const currentArticle = new Date(articles[i].created_at);
          const nextArticle = new Date(articles[i + 1].created_at);
          expect(currentArticle >= nextArticle).toBe(true);
        }
      });
  });
  describe("/api/articles", () => {
    test("200: should respond with all articles in descending order by default", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then(({ body }) => {
          const { articles } = body;
          expect(Array.isArray(articles)).toBe(true);
          expect(articles).toHaveLength(testData.articleData.length);
          articles.forEach((article) => {
            expect(article).toHaveProperty("title");
            expect(article).toHaveProperty("topic");
            expect(article).toHaveProperty("author");
            expect(article).toHaveProperty("created_at");
            expect(article).toHaveProperty("votes");
            expect(article.votes).toBeDefined();
            expect(article).toHaveProperty("comment_count");
            expect(article).toHaveProperty("article_img_url");
          });

          for (let i = 0; i < articles.length - 1; i++) {
            const currentArticle = new Date(articles[i].created_at);
            const nextArticle = new Date(articles[i + 1].created_at);
            expect(currentArticle >= nextArticle).toBe(true);
          }
        });
    });

    test("200: should respond with articles sorted by a specific column (sort_by=title, order=asc)", () => {
      return request(app)
        .get("/api/articles?sort_by=title&order=asc")
        .expect(200)
        .then(({ body }) => {
          const { articles } = body;
          expect(Array.isArray(articles)).toBe(true);
          expect(articles).toHaveLength(testData.articleData.length);

          for (let i = 0; i < articles.length - 1; i++) {
            const currentArticle = articles[i].title.toLowerCase();
            const nextArticle = articles[i + 1].title.toLowerCase();
            expect(currentArticle <= nextArticle).toBe(true);
          }
        });
    });

    test("200: should respond with articles sorted by votes in descending order (sort_by=votes, order=desc)", () => {
      return request(app)
        .get("/api/articles?sort_by=votes&order=desc")
        .expect(200)
        .then(({ body }) => {
          const { articles } = body;
          expect(Array.isArray(articles)).toBe(true);
          expect(articles).toHaveLength(testData.articleData.length);

          for (let i = 0; i < articles.length - 1; i++) {
            expect(articles[i].votes >= articles[i + 1].votes).toBe(true);
          }
        });
    });

    test("400: should respond with error if an invalid sort_by parameter is provided", () => {
      return request(app)
        .get("/api/articles?sort_by=invalid_column&order=asc")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Invalid sort_by column");
        });
    });

    test("400: should respond with error if an invalid order parameter is provided", () => {
      return request(app)
        .get("/api/articles?sort_by=title&order=invalid_order")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Invalid order value");
        });
    });

    test("200: should filter articles by topic", () => {
      const topic = "cats";
      return request(app)
        .get(`/api/articles?topic=${topic}`)
        .expect(200)
        .then(({ body }) => {
          const { articles } = body;
          expect(Array.isArray(articles)).toBe(true);
          articles.forEach((article) => {
            expect(article.topic).toBe(topic);
          });
        });
    });

    test("200: should return all articles if no topic query is provided", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then(({ body }) => {
          const { articles } = body;
          expect(Array.isArray(articles)).toBe(true);
          expect(articles).toHaveLength(testData.articleData.length);
        });
    });
  });
});

describe("getComments", () => {
  test("200: responds with an array of comments for the given article_id", () => {
    //const articleId = 1
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then(({ body }) => {
        const { comments } = body;
        expect(Array.isArray(comments)).toBe(true);
        console.log(testData.commentData, "<--testData comments array");
        console.log(comments, "<--comments array");
        expect(comments).toHaveLength(
          testData.commentData.filter((comment) => comment.article_id === 1)
            .length
        );
        comments.forEach((comment) => {
          expect(comment).toHaveProperty("comment_id");
          expect(comment).toHaveProperty("votes");
          expect(comment).toHaveProperty("created_at");
          expect(comment).toHaveProperty("author");
          expect(comment).toHaveProperty("body");
          expect(comment).toHaveProperty("article_id");
        });
        for (let i = 0; i < comments.length - 1; i++) {
          const currentComment = new Date(comments[i].created_at);
          const nextComment = new Date(comments[i + 1].created_at);
          expect(currentComment >= nextComment).toBe(true);
        }
      });
  });
});

describe("post comment", () => {
  test("201: responds with newly created comment object", () => {
    const newComment = {
      username: "butter_bridge",
      body: "I must say, I found it quite delightful.",
    };
    return request(app)
      .post("/api/articles/2/comments")
      .send(newComment)
      .then(({ body: { comment } }) => {
        console.log(comment);
        expect(comment).toEqual(
          expect.objectContaining({
            comment_id: expect.any(Number),
            body: "I must say, I found it quite delightful.",
            article_id: 2,
            author: "butter_bridge",
            votes: 0,
            created_at: expect.any(String),
          })
        );
      });
  });
  test("404: responds with error if user does not exist", () => {
    const newComment = {
      username: "madeUp_user",
      body: "This is a comment from a made up user.",
    };

    return request(app)
      .post("/api/articles/1/comments")
      .send(newComment)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("User not found");
      });
  });

  test("404: responds with error if article does not exist", () => {
    const newComment = {
      username: "butter_bridge",
      body: "This is a comment for a non-existent article.",
    };

    return request(app)
      .post("/api/articles/2024/comments")
      .send(newComment)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Article not found");
      });
  });
});

describe("PATCH /api/articles/:article_id", () => {
  test("should increment votes of article when given a possitive integer", () => {
    return request(app)
      .patch(`/api/articles/1`)
      .send({ inc_votes: 5 })
      .expect(200)
      .then((response) => {
        expect(response.body.article.votes).toBe(105);
      });
  });

  test("should decrement the votes of an article when given a negative integer", () => {
    return request(app)
      .patch(`/api/articles/1`)
      .send({ inc_votes: -3 })
      .expect(200)
      .then((response) => {
        expect(response.body.article.votes).toBe(97);
      });
  });

  test("should return a 400 error if inc_votes is not a number", () => {
    return request(app)
      .patch(`/api/articles/1`)
      .send({ inc_votes: "not-a-number" })
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Bad Request");
      });
  });

  test("should return a 404 error if article_id does not exist", () => {
    return request(app)
      .patch(`/api/articles/9999`)
      .send({ inc_votes: 3 })
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("Article not found");
      });
  });

  test("should return a 400 error if request body does not contain inc_votes", () => {
    return request(app)
      .patch(`/api/articles/1`)
      .send({}) // Missing inc_votes
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Bad Request");
      });
  });
});

describe("DELETE /api/comments/:comment_id", () => {
  test("should delete a comment when given a valid comment_id", () => {
    return request(app).delete(`/api/comments/1`).expect(204); // Status 204 with no content
  });

  test("should return 404 if the comment_id does not exist", () => {
    return request(app)
      .delete(`/api/comments/372`)
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("Comment not found");
      });
  });

  test("should return 400 if the comment_id is not a valid number", () => {
    return request(app)
      .delete("/api/comments/not-a-number")
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Bad Request");
      });
  });
});

describe("GET /api/users", () => {
  test("200: Responds with an object detailing the users data", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body }) => {
        console.log(body);
        const { users } = body;
        expect(Array.isArray(users)).toBe(true);
        users.forEach((user) => {
          expect(user).toMatchObject({
            username: expect.any(String),
            name: expect.any(String),
            avatar_url: expect.any(String),
          });
        });
      });
  });
  test("404: should get error 404 if invalid input", () => {
    return request(app)
      .get("/api/doesnotexist")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not Found");
      });
  });
});
