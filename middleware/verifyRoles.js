const verifyRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req?.roles) return res.sendStatus(401);
    const rolesArray = [...allowedRoles];
    console.log("This is input roles: ", rolesArray);
    console.log(`This is the roles getting from req : ${req.roles}`);
    const result = req.roles.map((role) => rolesArray.includes(role));
    console.log(`THE RESULT IS ${result}`);
    const resultArr = result.find((val) => val === true);
    console.log(`THE RESULTARAAY is ${resultArr}`);
    // const result = req.roles
    //   .map((role) => rolesArray.includes(role))
    //   .find((val) => val === true);
    // console.log("RESULT", result);
    // if (!result) return res.sendStatus(401);
    if (!resultArr) return res.sendStatus(401);
    next();
  };
};

module.exports = verifyRoles;
