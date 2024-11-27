const db = require("../connection");
const { comments, articles } = require("../data/test-data/index");

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
