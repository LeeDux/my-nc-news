const db = require("../connection");
const { users } = require("../data/test-data/index");

exports.selectUsers = () => {
  return db.query(`SELECT * FROM users`).then(({ rows }) => {
    return rows;
  });
};
