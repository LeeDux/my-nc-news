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

exports.selectAllArticles = () => {
  return db
    .query(
      `SELECT
        articles.article_id,
        articles.title,
        articles.topic,
        articles.author,
        articles.created_at,
        COALESCE(articles.votes, 0) AS votes,
        COALESCE(COUNT(comments.comment_id), 0) AS comment_count,  
        articles.article_img_url
      FROM articles
      LEFT JOIN comments ON comments.article_id = articles.article_id
      GROUP BY articles.article_id
      ORDER BY articles.created_at DESC`
    )
    .then(({ rows }) => {
      //console.log(result);
      return rows;
    });
};
