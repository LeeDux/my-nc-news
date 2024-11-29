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

  if (article_id) {
    sqlQuery += `WHERE article_id = $1 `;
    queryValues.push(article_id);
  }

  return db.query(sqlQuery, queryValues).then(({ rows }) => {
    return rows;
  });
};

exports.selectAllArticles = (topic, sort_by = "created_at", order = "desc") => {
  const validColumns = ["created_at", "votes", "title", "article_id", "author"];
  const validOrders = ["asc", "desc"];

  if (!validColumns.includes(sort_by)) {
    return Promise.reject({ status: 400, msg: "Invalid sort_by column" });
  }

  if (!validOrders.includes(order)) {
    return Promise.reject({ status: 400, msg: "Invalid order value" });
  }

  let sqlQuery = `
    SELECT
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
  `;

  const queryValues = [];

  if (topic) {
    sqlQuery += ` WHERE articles.topic = $1`;
    queryValues.push(topic);
  }

  // Append GROUP BY and ORDER BY clauses
  sqlQuery += ` GROUP BY articles.article_id ORDER BY articles.${sort_by} ${order.toUpperCase()}`;

  // Execute the query with the appropriate values
  return db.query(sqlQuery, queryValues).then(({ rows }) => {
    return rows;
  });
};
