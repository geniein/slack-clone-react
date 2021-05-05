require('dotenv').config();

console.log(process.env.MYSQL_PASSWORD);
module.exports = {
  "development": {
    "username": "root",
    "password": process.env.MYSQL_PASSWORD,
    "database": "slack",
    "host": "127.0.0.1",
    "dialect": "mysql"
  },
  "test": {
    "username": "root",
    "password": process.env.MYSQL_PASSWORD,
    "database": "slack",
    "host": "127.0.0.1",
    "dialect": "mysql"
  },
  "production": {
    "username": "root",
    "password": process.env.MYSQL_PASSWORD,
    "database": "slack",
    "host": "127.0.0.1",
    "dialect": "mysql"
  }
}
