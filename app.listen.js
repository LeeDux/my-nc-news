/* const app = require("../db/app");

app.listen(8000, () => {
  console.log("Server is listening on port 8000...");
}); */

const app = require("./app");
const { PORT = 8000 } = process.env;

app.listen(PORT, () => console.log(`Listening on ${PORT}...`));
