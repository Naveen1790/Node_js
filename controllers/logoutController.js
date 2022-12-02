// const userDB = {
//   users: require("../model/users.json"),
//   setUser: function (data) {
//     this.users = data;
//   },
// };

// const fspromises = require("fs").promises;
// const path = require("path");

const User = require("../model/User");

const handleLogout = async (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) return res.sendStatus(204); //No content
  const refreshToken = cookies.jwt;

  //Is refreshToken in DB?
  // const foundUser = userDB.users.find(
  //   (person) => person.refreshToken === refreshToken
  // );
  const foundUser = await User.findOne({ refreshToken }).exec();
  if (!foundUser) {
    res.clearCookie("jwt", {
      httpOnly: true,
      sameSite: "None",
      secure: true,
      maxAge: 24 * 60 * 60 * 1000,
    }); //max age is not required
    return res.sendStatus(204);
  }
  //delete refreshToken in DB
  // const otherUsers = userDB.users.filter(
  //   (person) => person.refreshToken !== refreshToken
  // );
  // const currentUser = { ...foundUser, refreshToken: "" };
  // userDB.setUser([...otherUsers, currentUser]);
  // await fspromises.writeFile(
  //   path.join(__dirname, "..", "model", "users.json"),
  //   JSON.stringify(userDB.users)
  // );

  foundUser.refreshToken = "";
  const result = await foundUser.save();
  console.log(result);
  res.clearCookie("jwt", {
    httpOnly: true,
    sameSite: "None",
    secure: true,
    maxAge: 24 * 60 * 60 * 1000,
  }); //secure:true :- only serves on https
  res.sendStatus(204);
};

module.exports = { handleLogout };
