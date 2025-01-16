const { users } = require("../models");
const bcrypt = require("bcrypt");

class UserController {
  static async getUserInfo(req, res) {
    try {
      let result = await users.findAll();
      res.json(result);
    } catch (err) {
      res.json(err);
    }
  }
  static async register(req, res) {
    try {
      const { name, username, email, password, department, role } = req.body;
      let sameUsername = await users.findOne({
        where: {
          username: username,
        },
      });

      if (sameUsername) {
        return res.status(400).json({ error: "Username is already taken" });
      }

      function generateRandomId(length) {
        const min = Math.pow(10, length - 1);
        const max = Math.pow(10, length) - 1;
        const randomId = Math.floor(Math.random() * (max - min + 1)) + min;

        return randomId.toString();
      }
      const userid = generateRandomId(6);

      const hashedPassword = await bcrypt.hash(password, 10);

      let result = await users.create({
        userid,
        name,
        username,
        email,
        password: hashedPassword,
        department,
        role,
      });

      res.json(result);
    } catch (err) {
      res.json(err);
    }
  }
  static async login(req, res) {
    try {
      const { username, password } = req.body;
      const result = await users.findOne({
        where: { username: username },
      });

      const isPasswordValid = await bcrypt.compare(password, result.password);
      
      if (!result || !isPasswordValid) {
        return res.status(401).json({ error: "The username or password you entered is incorrect." });
      } else {
        res.json(result);
      }
    } catch (err) {
      console.error("Error logging in:", err);
      res.status(500).json({ error: "An error occurred during login" });
    }
  }
  static async getOneUser(req, res) {
    try {
      const { username } = req.params;
      let result = await users.findOne({
        where: { username: username },
      });
      res.json(result);
    } catch (error) {
      res.json(error);
    }
  }
  static async forgetPassword(req, res) {
    try {
      const { username, password } = req.body;
      const findUser = await users.findOne({
        where: { username: username },
      });

      const hashedPassword = await bcrypt.hash(password, 10);

      findUser.update(
        {
          password: hashedPassword,
        },
        { where: { id: findUser.id } }
      );
      res.json(findUser);
    } catch (error) {
      res.json(error);
    }
  }
}

module.exports = UserController;
