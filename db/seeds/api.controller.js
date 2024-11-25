const endpointsJson = require("../../endpoints.json");
const { selectTopics } = require("./api.model");

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
