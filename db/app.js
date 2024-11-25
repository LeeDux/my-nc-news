const express = require("express");
const app = express();
app.use(express.json());
const getApi = require("../db/seeds/api.controller");
console.log("I am in app");
app.get("/api", getApi);
module.exports = app;
