// const userDB = {
//   users: require("../model/users.json"),
//   setUser: function (data) {
//     this.users = data;
//   },
// };
const User = require("../model/User");
const jwt = require("jsonwebtoken");

const handlerefreshToken = async(req, res) => {
  const cookies = req.cookies;
  console.log(cookies);
  if (!cookies?.jwt) return res.sendStatus(401);
  const refreshToken = cookies.jwt;
  console.log(cookies, refreshToken);

  // const foundUser = userDB.users.find(
  //   (person) => person.refreshToken === refreshToken
  // );
  const foundUser = await User.findOne({ refreshToken }).exec();
  if (!foundUser) return res.sendStatus(403); //unauthorised
  //evaluate jwt
  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decode) => {
    const roles = Object.values(foundUser.roles);
    if (err || foundUser.username !== decode.username)
      return res.sendStatus(403);
    const accessToken = jwt.sign(
      {
        userInfo: {
          username: decode.username,
          roles: roles,
        },
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "30s" }
    );
    res.json({ accessToken });
  });
};

module.exports = { handlerefreshToken };
