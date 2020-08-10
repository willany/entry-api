const knex = require("knex");

exports.up = function (knex) {
  return knex.schema.createTable("entries", (table) => {
    table.increments("id").primary();
    table.string("date").notNullable();
    table.string("start_hour");
    table.string("start_lunch_break");
    table.string("end_lunch_break");
    table.string("end_hour");

    table
      .integer("user_id")
      .notNullable()
      .references("id")
      .inTable("users")
      .onUpdate("CASCADE")
      .onDelete("CASCADE");

    table.unique(["id", "date"]);
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("entries");
};
