const endpointsJson = require("../../endpoints.json");
const articles = require("../data/test-data/articles");
const { checkArticleExists } = require("./api.comments.model"); // Use checkArticleExists from api.comments.model.js

const {
  selectTopics,
  selectArticle,
  selectAllArticles,
} = require("./api.model");
const {
  selectComments,
  addComment,
  deleteComment,
} = require("./api.comments.model");
const { updateVotes } = require("./api.articles.model");
const { selectUsers } = require("./api.users.model");

console.log("in controller");

const isValidId = (id) => !isNaN(id) && Number.isInteger(parseFloat(id));

exports.getApi = (req, res) => {
  console.log(endpointsJson, "<--- endpoints json");
  res.status(200).send({ endpoint: endpointsJson });
};

exports.getTopics = (req, res, next) => {
  selectTopics()
    .then((topics) => {
      if (topics.length === 0 || !topics) {
        const error = new Error("Not Found");
        error.status = 404;
        return next(error);
      }
      res.status(200).send({ topics });
    })
    .catch(next);
};

exports.getAllArticles = (req, res, next) => {
  const { topic, sort_by = "created_at", order = "desc" } = req.query;
  selectAllArticles(topic, sort_by, order)
    .then((articles) => {
      console.log(articles, "<---articles fetched should be 13");
      if (articles.length === 0) {
        const error = new Error("Topic Not Found");
        error.status = 404;
        return next(error);
      }
      res.status(200).send({ articles });
    })
    .catch((err) => {
      console.error("Error fetching articles:", err);
      next(err);
    });
};

exports.getArticleById = (req, res, next) => {
  const { article_id } = req.params;

  if (!isValidId(article_id)) {
    return res.status(400).send({ msg: "Invalid Article ID" });
  }

  checkArticleExists(article_id)
    .then(() => selectArticle(article_id))
    .then((article) => {
      if (article.length === 0 || !article) {
        const error = new Error("Not Found");
        error.status = 404;
        return next(error);
      }
      res.status(200).send({ article: article[0] });
    })
    .catch(next);
};

exports.getComments = (req, res, next) => {
  const { article_id } = req.params;
  if (!isValidId(article_id)) {
    return res.status(400).send({ msg: "Invalid Article ID" });
  }
  selectComments(article_id)
    .then((comments) => {
      if (comments.length === 0 || !comments) {
        const error = new Error("Not Found");
        error.status = 404;
        return next(error);
      }
      res.status(200).send({ comments });
    })
    .catch(next);
};

exports.postComment = (req, res, next) => {
  const { article_id } = req.params;
  const comment = req.body;
  if (!isValidId(article_id)) {
    return res.status(400).send({ msg: "Invalid Article ID" });
  }
  addComment(article_id, comment)
    .then((newComment) => {
      res.status(201).send({ comment: newComment });
    })
    .catch(next);
};

exports.patchVotes = (req, res, next) => {
  const { article_id } = req.params;
  const { inc_votes } = req.body;

  if (typeof inc_votes !== "number") {
    const error = new Error("Invalid request");
    error.status = 400;
    return next(error);
  }

  updateVotes(article_id, inc_votes)
    .then((updatedArticle) => {
      res.status(200).send({ article: updatedArticle });
    })
    .catch(next);
};

exports.deleteCommentByiD = (req, res, next) => {
  const { comment_id } = req.params;

  deleteComment(comment_id)
    .then(() => {
      res.status(204).send();
    })
    .catch(next);
};

exports.getUsers = (req, res, next) => {
  selectUsers()
    .then((users) => {
      if (users.length === 0 || !users) {
        const error = new Error("Not Found");
        error.status = 404;
        return next(error);
      }
      res.status(200).send({ users });
    })
    .catch(next);
};
