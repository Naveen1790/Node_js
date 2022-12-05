// const userDB = {
//   users: require("../model/users.json"),
//   setUser: function (data) {
//     this.users = data;
//   },
// }; //this is used o get the data from the local but now we are going to deal with mongoDB

const User = require("../model/User");

const bcrypt = require("bcrypt");
// const fspromises = require("fs").promises;
// const path = require("path");

const handleNewUser = async (req, res) => {
  const { user, pwd } = req.body;
  if (!user || !pwd)
    return res
      .status(400)
      .json({ message: "Username and password are required" });
  // const duplicateUser = userDB.users.find((person) => person.username === user);
  const duplicateUser = await User.findOne({ username: user }).exec();
  if (duplicateUser) return res.sendStatus(409); //confict
  try {
    //encrpt the password
    const hashpwd = await bcrypt.hash(pwd, 10);
    //create & store the new user

    const result = await User.create({
      username: user,
      roles: { User: 2001, Editor: 1984, Admin: 5150 }, //if you don't provide roles by default it will take USER:2001 becuase we have mentioned it as default in User.js
      password: hashpwd,
    });
    //from 34 to 39 that is the 2nd way to create & store the user register info
    // const newUser = new User({
    //   username: user,
    //   password:hashpwd
    // })
    // const resultDta = await newUser.save()
    // console.log(resultDta)
    console.log(result);
    // const newUser = {
    //   username: user,
    //   roles: { User: 2001 },
    //   password: hashpwd,
    // };
    // userDB.setUser([...userDB.users, newUser]);
    // await fspromises.writeFile(
    //   path.join(__dirname, "..", "model", "users.json"),
    //   JSON.stringify(userDB.users)
    // );
    // console.log(userDB.users);
    res.status(201).json({ message: `New user ${user} created` });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

module.exports = { handleNewUser };
