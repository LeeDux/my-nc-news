const db = require("../connection");
const { comments, articles } = require("../data/test-data/index");
//const { checkArticleExists } = require("./api.model");

exports.selectComments = (article_id) => {
  let sqlQuery = `SELECT
   comment_id,
    votes,
    created_at,
    author,
    body,
    article_id 
    FROM comments 
    WHERE article_id = $1
    ORDER BY created_at DESC`;
  return db.query(sqlQuery, [article_id]).then(({ rows }) => {
    return rows;
  });
};

exports.checkArticleExists = (article_id) => {
  return db
    .query(`SELECT * FROM articles WHERE article_id = $1`, [article_id])
    .then(({ rows }) => {
      if (!rows.length) {
        return Promise.reject({ status: 404, msg: "Article not found" });
      }
    });
};

exports.checkUserExists = (username) => {
  return db
    .query("SELECT * FROM users WHERE username = $1", [username])
    .then((result) => {
      if (result.rows.length === 0) {
        return Promise.reject({ status: 404, msg: "User not found" });
      }
    });
};

exports.addCommentToDataBase = (article_id, comment) => {
  const { username, body } = comment;
  return db
    .query(
      `INSERT INTO comments (article_id, author, body, votes, created_at) 
        VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP) 
        RETURNING *`,
      [article_id, username, body, 0]
    )
    .then(({ rows }) => {
      return rows[0];
    });
};

exports.addComment = (article_id, comment) => {
  const { username, body } = comment;
  return Promise.all([
    exports.checkUserExists(username),
    exports.checkArticleExists(article_id),
  ]).then(() => {
    return exports.addCommentToDataBase(article_id, comment);
  });
};
