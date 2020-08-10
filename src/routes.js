const express = require("express");
const routes = express.Router();

const UsersController = require("./controllers/UsersController");
const EntriesController = require("./controllers/EntriesController");

routes.post("/users", UsersController.create);
routes.get("/users", UsersController.show);
routes.post("/authenticate", UsersController.authenticate);

routes.post("/entries", EntriesController.create);
routes.get("/entries", EntriesController.show);

module.exports = routes;
