// const userDB = {
//   users: require("../model/users.json"),
//   setUser: function (data) {
//     this.users = data;
//   },
// };

const User = require("../model/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
// const fspromises = require("fs").promises;
// const path = require("path");

const handleLogin = async (req, res) => {
  const { user, pwd } = req.body;
  if (!user || !pwd)
    return res
      .status(400)
      .json({ message: "Username and password are required" });
  // const foundUser = userDB.users.find((person) => person.username === user);
  const foundUser = await User.findOne({ username: user }).exec();
  if (!foundUser) return res.sendStatus(401); //unauthorised
  //evaluate password
  const match = await bcrypt.compare(pwd, foundUser.password);
  if (match) {
    //create JWTs
    const roles = Object.values(foundUser.roles);
    const accessToken = jwt.sign(
      {
        userInfo: {
          username: foundUser.username,
          roles: roles,
        },
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "30s" }
    );
    const refreshToken = jwt.sign(
      { username: foundUser.username },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "1d" }
    );
    //saving refresh token with current user
    // const otherUsers = userDB.users.filter(
    //   (person) => person.username !== foundUser.username
    // );
    // const currentUser = { ...foundUser, refreshToken };
    // userDB.setUser([...otherUsers, currentUser]);
    // await fspromises.writeFile(
    //   path.join(__dirname, "..", "model", "users.json"), 
    //   JSON.stringify(userDB.users)
    // );
    foundUser.refreshToken = refreshToken;
    const result = await foundUser.save();
    console.log(result);
    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      sameSite: "None",
      secure: true, //if you want to check the refreshtoken in thunderpoint u need to comment this line or else refresh endpoint woint work
      maxAge: 24 * 60 * 60 * 1000,
    });
    res.json({ accessToken });
    // res.json({ message: `User ${user} is logged in` });
  } else {
    res.sendStatus(401);
  }
};

module.exports = { handleLogin };
