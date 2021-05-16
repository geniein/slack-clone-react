const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const passport = require("passport");
const helmet = require("helmet");

dotenv.config();
const passportConfig = require("./passport");

const app = express();
app.set("PORT", process.env.PORT || 3055);

const server = app.listen(app.get("PORT"), () => {
    console.log(`listening on port ${app.get("PORT")}`);
});
passportConfig();