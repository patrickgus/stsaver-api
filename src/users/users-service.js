const bcrypt = require("bcryptjs");
const xss = require("xss");

const REGEX_UPPER_LOWER_NUMBER_SPECIAL = /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&])[\S]+/;

const UsersService = {
  getAllUsers(db) {
    return db.select("*").from("stsaver_users");
  },

  hasUserWithUserName(db, username) {
    return db("stsaver_users")
      .where({ username })
      .first()
      .then(user => !!user);
  },

  insertUser(db, newUser) {
    return db
      .insert(newUser)
      .into("stsaver_users")
      .returning("*")
      .then(([user]) => user);
  },

  validatePassword(password) {
    if (password.length < 8) {
      return "Password must be longer than 8 characters";
    }
    if (password.length > 72) {
      return "Password must be less than 72 characters";
    }
    if (password.startsWith(" ") || password.endsWith(" ")) {
      return "Password must not start or end with empty spaces";
    }
    if (!REGEX_UPPER_LOWER_NUMBER_SPECIAL.test(password)) {
      return "Password must contain one upper case, lower case, number and special character(!,@,#,$,%,^,&)";
    }
    return null;
  },

  hashPassword(password) {
    return bcrypt.hash(password, 12);
  },

  getById(db, id) {
    return db
      .from("stsaver_users")
      .select("*")
      .where("id", id)
      .first();
  },

  deleteUser(db, id) {
    return db("stsaver_users")
      .where({ id })
      .delete();
  },

  updateUser(db, id, newUserFields) {
    return db("stsaver_users")
      .where({ id })
      .update(newUserFields);
  },

  serializeUser(user) {
    return {
      id: user.id,
      first_name: xss(user.first_name),
      last_name: xss(user.last_name),
      username: xss(user.username),
      date_joined: new Date(user.date_joined)
    };
  }
};

module.exports = UsersService;
