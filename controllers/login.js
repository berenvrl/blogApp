const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const loginRouter = require("express").Router();
const User = require("../models/user");

loginRouter.post("/", async (request, response) => {
  const { username, password } = request.body;

  //searching for username requested in db
  const user = await User.findOne({ username });

  //checks password
  const passwordCorrect =
    user === null ? false : await bcrypt.compare(password, user.passwordHash);

  if (!(user && passwordCorrect)) {
    return response.status(401).json({ error: "invalid username or password" });
  }

  const userForToken = {
    username: user.username,
    id: user.id,
  };

  //creating token for user authentication
  //Due to API user(eg React) gets a token, the API has a blind trust to the token holder. As a solution, limit validty =>one hour
  const token = jwt.sign(userForToken, process.env.SECRET, {
    // expiresIn: 60 * 60,
    expiresIn: 60 * 3600,
  });

  response
    .status(200)
    .send({ token, username: user.username, name: user.name });
});

module.exports = loginRouter;

/*
NOTES
npm install jsonwebtoken=> allow to generate json web tokens

bcrypt.compare()=> check ,f the password is correct, we cant directly check password because its not saved in db
*/
