const db = require("../connection");
const { topics, articles } = require("../data/test-data/index");
console.log("In model");

exports.selectTopics = (topics) => {
  //console.log(topics, "<---model");
  return db.query(`SELECT * FROM topics`).then(({ rows }) => {
    return rows;
  });
};

exports.checkArticleExists = (article_id) => {
  return db
    .query(`SELECT * FROM articles WHERE article_id = $1`, [article_id])
    .then(({ rows }) => {
      if (!rows.length) {
        return Promise.reject({ status: 404, msg: "Not Found" });
      }
    });
};

exports.selectArticle = (article_id) => {
  let sqlQuery = `SELECT * FROM articles `;
  const queryValues = [];
  if (article_id) {
    sqlQuery += `WHERE article_id = $1 `;
    queryValues.push(article_id);
  }
  return db.query(sqlQuery, queryValues).then(({ rows }) => {
    return rows;
  });
};
