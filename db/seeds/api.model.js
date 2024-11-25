const db = require("../connection");
console.log("In model");

exports.selectTopics = (topics) => {
  console.log(topics, "<---model");
  return db.query(`SELECT * FROM topics`).then(({ rows }) => {
    return rows;
  });
};
