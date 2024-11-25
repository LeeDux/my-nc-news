const endpointsJson = require("../../endpoints.json");

function getApi(req, res) {
  console.log(endpointsJson, "<--- endpoints json");
  res.status(200).send({ endpoint: endpointsJson });
}

module.exports = getApi;
