const jwt = require("jsonwebtoken");

const verifyJWT = (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;
  if (!authHeader?.startsWith("Bearer ")) return res.sendStatus(401);
  console.log(authHeader); //Bearer token
  const token = authHeader.split(" ")[1];
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decode) => {
    console.log(`This is the error causing: ${err}`);
    console.log(decode);
    if (err) return res.sendStatus(403);
    req.user = decode.userInfo.username;
    req.roles = decode.userInfo.roles
    next();
  });
};

module.exports = verifyJWT;
