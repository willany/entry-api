const kenx = require("knex");
const path = require("path");

const db = kenx({
  client: "sqlite3",
  connection: {
    filename: path.resolve(__dirname, "database.sqlite"),
  },
  useNullAsDefault: true,
});

module.exports = db;
