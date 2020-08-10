const jwt = require("jsonwebtoken");
const db = require("../database/connections");
const { andWhere } = require("../database/connections");
const { use } = require("../routes");

const authConfig = require("../config/auth.json");

function generateToken(id) {
  return jwt.sign({ id }, authConfig.secret, {
    expiresIn: 86400,
  });
}

class UsersController {
  async create(request, response) {
    const { name, email, role, startDate, password } = request.body;

    const transaction = await db.transaction();

    try {
      const user = await transaction("users").insert({
        name,
        email,
        role,
        startDate,
        password,
      });
      await transaction.commit();

      const id = user[0];
      const token = generateToken(id);

      return response
        .status(201)
        .send({ id, name, email, role, startDate, token });
    } catch (error) {
      transaction.rollback();

      console.log(error);
      return response.status(400).json({
        error: "Unexpeted error while creating user",
      });
    }
  }
  async show(request, response) {
    const { id } = request.query;
    const users = await db("users").where("id", id);
    const { name, email, role, startDate } = users[0];
    return response.json({ id, name, email, role, startDate });
  }
  async authenticate(request, response) {
    const { email, password } = request.body;

    const user = await db("users")
      .where("email", email)
      .andWhere("password", password);

    if (user.length <= 0) {
      response.status(400).send({ error: "User not found!" });
    }
    const { id, name, role, startDate } = user[0];

    const token = generateToken(id);

    response.send({ id, name, email, role, startDate, token });
  }
}

module.exports = new UsersController();
