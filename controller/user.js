const bcrypt = require("bcryptjs");
const { v4: uuidv4 } = require("uuid");
const jwt = require("jsonwebtoken");
const Joi = require("joi");
const { selectAllUsers, findEmail, createUsers, searchUser } = require("../model/user");
const commonHelper = require("../helper/common");
const authHelper = require("../helper/auth");

let userController = {

  getAllUser: async (req, res) => {
    try {
      const result = await selectAllUsers();
      commonHelper.response(res, result.rows, 200, "get data success");
    } catch (error) {
      console.log(error);
    }
  },

  getSearchUser: async (req, res) => {
    try {
      const searchBy = req.query.keyword;
      const result = await searchUser(searchBy);
      commonHelper.response(res, result.rows, 200, "get data success");
    } catch (error) {
      console.log(error);
    }
  },

  registerUser: async (req, res) => {
    let { users_fullname, users_email, users_password } = req.body;
    const { rowCount } = await findEmail(users_email);
    if (rowCount) {
      return res.json({ message: "Email is Already Taken" });
    }
    const users_passwordHash = bcrypt.hashSync(users_password);
    const users_id = uuidv4();

    const schema = Joi.object().keys({
      users_fullname: Joi.string().required(),
      users_email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required().messages({
        'string.email': 'Email must be valid and contain the character "@"',
        'any.required': 'Email must be filled in'
      }),
      users_password: Joi.string().min(3).max(15).required(),
    });

    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
    });

    if (error) {
      console.log(error); 
      return res.send(error.details);
    }


    const data = {
      users_id,
      users_fullname,
      users_email,
      users_passwordHash
    };
    createUsers(data)
      .then((result) => {
        commonHelper.response(res, result.rows, 201, "email is created");
      })
      .catch((err) => {
        console.log(err);
      });
  },

  loginUser: async (req, res) => {
    const { users_email, users_password } = req.body;
    const {
      rows: [users],
    } = await findEmail(users_email);
    console.log(users);
    if (!users) {
      return res.json({ message: "Email is incorrect" });
    }
    const isValidPassword = bcrypt.compareSync(users_password, users.users_password);
    if (!isValidPassword) {
      return res.json({ message: "Password is incorrect" });
    }
    delete users.users_password; // Menghapus users_password dari objek users
    const payload = {
      users_email: users.users_email
    };
    users.token = authHelper.generateToken(payload);
    users.refreshToken = authHelper.refreshToken(payload);
    commonHelper.response(res, users, 201, "login is successful");
},

  profile: async (req, res) => {
    const email = req.payload.email;
    const {
      rows: [users],
    } = await findEmail(email);
    delete users.users_password;
    commonHelper.response(res, users, 200);
  },

  RefreshToken: (req, res) => {
    const refreshToken = req.body.RefreshToken
    const decoded = jwt.verify(refreshToken, process.env.SECRETE_KEY_JWT)
    const payload = {
      users_email: decoded.users_email,
    }
    const result = {
      token: authHelper.generateToken(payload),
      refreshToken: authHelper.refreshToken(payload)
    }
    commonHelper.response(res, result, 200, "Token is Already generate");


  }
};

module.exports = userController;