const endpointsJson = require("../../endpoints.json");
const articles = require("../data/test-data/articles");
const { checkArticleExists } = require("./api.articles.model");
const { selectTopics, selectArticle } = require("./api.model");

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

exports.getArticle = (req, res, next) => {
  const { article_id, sort_by } = req.query;
  const promises = [selectArticle(article_id, sort_by)];
  if (article_id) {
    promises.push(checkArticleExists(article_id));
  }
  Promise.all(promises)
    .then(([articles]) => {
      res.send(200).send({ articles });
    })
    .catch(next);
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
