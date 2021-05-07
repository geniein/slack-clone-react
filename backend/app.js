const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const session = require("express-session");

dotenv.config();

const app = express();
app.set("PORT", process.env.PORT || 3055);

const server = app.listen(app.get("PORT"), () => {
    console.log(`listening on port ${app.get("PORT")}`);
});