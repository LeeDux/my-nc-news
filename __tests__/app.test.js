const endpointsJson = require("../endpoints.json");
/* Set up your test imports here */
const request = require("supertest");
const app = require("../db/app.js");
const db = require("../db/connection"); //look here
const testData = require("../db/data/test-data");
const seed = require("../db/seeds/seed");

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
  test.only("404: should return 404 if article not found", () => {
    return request(app)
      .get("/api/articles/2024")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not Found");
      });
  });
});
