const db = require("../connection");
const { topics, articles } = require("../data/test-data/index");

console.log("In model");

exports.selectTopics = () => {
  return db.query(`SELECT * FROM topics`).then(({ rows }) => {
    return rows;
  });
};

exports.selectArticle = (article_id) => {
  let sqlQuery = `SELECT * FROM articles `;
  const queryValues = [];

  // Validate article_id
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
      return rows;
    });
};
