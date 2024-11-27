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
        expect(body.msg).toBe("Not Found");
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
