const express = require("express");
const app = express();
app.use(express.json());

const {
  getApi,
  getTopics,
  getArticleById,
  getAllArticles,
  getComments,
  postComment,
  patchVotes,
} = require("../db/seeds/api.controller");

console.log("I am in app");

app.get("/api", getApi);

app.get("/api/topics", getTopics);

app.get("/api/articles", getAllArticles);

app.get("/api/articles/:article_id", getArticleById);

app.get("/api/articles/:article_id/comments", getComments);

app.post("/api/articles/:article_id/comments", postComment);

app.patch("/api/articles/:article_id", patchVotes);

app.all("*", (req, res) => {
  res.status(404).send({ msg: "Not Found" });
});

app.use((err, req, res, next) => {
  console.error(err);

  if (err.code === "22P02") {
    return res.status(400).send({ msg: "Bad Request" });
  }

  if (err.status && err.msg) {
    return res.status(err.status).send({ msg: err.msg });
  }

  if (err.status === 400) {
    return res.status(400).send({ msg: "Bad Request" });
  }

  if (err.status === 404) {
    return res.status(404).send({ msg: "Not Found" });
  }

  return res.status(500).send({ msg: "Internal Server Error" });
});

module.exports = app;
