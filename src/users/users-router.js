const path = require("path");
const express = require("express");
const UsersService = require("./users-service");

const usersRouter = express.Router();
const jsonParser = express.json();

usersRouter
  .route("/")
  .get((req, res, next) => {
    UsersService.getAllUsers(req.app.get("db"))
      .then(users => {
        res.json(users.map(UsersService.serializeUser));
      })
      .catch(next);
  })
  .post(jsonParser, (req, res, next) => {
    const { password, username, first_name, last_name } = req.body;

    for (const field of ["first_name", "last_name", "username", "password"])
      if (!req.body[field])
        return res.status(400).json({
          error: `Missing '${field}' in request body`
        });

    const passwordError = UsersService.validatePassword(password);

    if (passwordError) return res.status(400).json({ error: passwordError });

    UsersService.hasUserWithUserName(req.app.get("db"), username)
      .then(hasUserWithUserName => {
        if (hasUserWithUserName)
          return res.status(400).json({ error: `Username already taken` });

        return UsersService.hashPassword(password).then(hashedPassword => {
          const newUser = {
            username,
            password: hashedPassword,
            first_name,
            last_name,
            date_joined: "now()"
          };

          return UsersService.insertUser(req.app.get("db"), newUser).then(
            user => {
              res
                .status(201)
                .location(path.posix.join(req.originalUrl, `/${user.id}`))
                .json(UsersService.serializeUser(user));
            }
          );
        });
      })
      .catch(next);
  });

usersRouter
  .route("/:user_id")
  .all((req, res, next) => {
    UsersService.getById(req.app.get("db"), req.params.user_id)
      .then(user => {
        if (!user) {
          return res.status(404).json({
            error: { message: `User doesn't exist` }
          });
        }
        res.user = user;
        next();
      })
      .catch(next);
  })
  .get((req, res, next) => {
    res.json(UsersService.serializeUser(res.user));
  })
  .delete((req, res, next) => {
    UsersService.deleteUser(req.app.get("db"), req.params.user_id)
      .then(numRowsAffected => {
        res.status(204).end();
      })
      .catch(next);
  })
  .patch(jsonParser, (req, res, next) => {
    const { password, username, first_name, last_name } = req.body;
    const userToUpdate = { password, username, first_name, last_name };

    const numberOfValues = Object.values(userToUpdate).filter(Boolean).length;
    if (numberOfValues === 0)
      return res.status(400).json({
        error: {
          message: `Request body must contain either 'first_name', 'last_name', 'username', or 'password'`
        }
      });

    // if (password) {
    //   const passwordError = UsersService.validatePassword(password);
    //   if (passwordError) {
    //     return res.status(400).json({ error: passwordError });
    //   }

    //   return UsersService.hashPassword(password).then(hashedPassword => {
    //     userToUpdate = {
    //       password: hashedPassword
    //     };
    //   });
    // }

    UsersService.updateUser(req.app.get("db"), req.params.user_id, userToUpdate)
      .then(numRowsAffected => {
        res.status(204).end();
      })
      .catch(next);
  });

module.exports = usersRouter;
