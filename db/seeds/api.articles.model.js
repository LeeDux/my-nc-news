const db = require("../connection");

exports.updateVotes = (article_id, inc_votes) => {
  const sqlQuery = `UPDATE articles 
                    SET votes = votes + $1 
                    WHERE article_id = $2 
                    RETURNING *`;

  return db.query(sqlQuery, [inc_votes, article_id]).then(({ rows }) => {
    if (rows.length === 0) {
      return Promise.reject({ status: 404, msg: "Article not found" });
    }
    return rows[0];
  });
};
