const endpointsJson = require("../../endpoints.json");
const articles = require("../data/test-data/articles");
const { checkArticleExists } = require("./api.articles.model");
const {
  selectTopics,
  selectArticle,
  selectAllArticles,
} = require("./api.model");
const { selectComments } = require("./api.comments.model");

console.log("in controller");

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
  selectAllArticles()
    .then((articles) => {
      console.log(articles, "<---articles fetched should be 13");
      res.status(200).send({ articles });
    })
    .catch((err) => {
      console.error("Error fetching articles:", err);
      next(err);
    });
};

exports.getArticleById = (req, res, next) => {
  const { article_id } = req.params;
  selectArticle(article_id)
    .then((article) => {
      console.log(article, "<--article in controller");
      if (article.length === 0 || !article) {
        const error = new Error("Not Found");
        error.status = 404;
        console.log(error, "<--err in the controller");
        return next(error);
      }
      res.status(200).send({ article: article[0] });
    })
    .catch(next);
};

exports.getComments = (req, res, next) => {
  const { article_id } = req.params;
  selectComments(article_id)
    .then((comments) => {
      console.log(comments, "<--article in controller");
      if (comments.length === 0 || !comments) {
        const error = new Error("Not Found");
        error.status = 404;
        console.log(error, "<--err in the controller");
        return next(error);
      }
      res.status(200).send({ comments });
    })
    .catch(next);
};
