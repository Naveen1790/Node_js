require("dotenv").config();
const express = require("express");
const app = express();
const path = require("path");
const port = process.env.PORT || 3500;
const { logger } = require("./middleware/logEvents");

const errorHandler = require("./middleware/errorHandler");
const corsOptions = require("./config/corsOptions");
const cors = require("cors");
const verifyJWT = require("./middleware/verifyJWT");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const connectDB = require("./config/dbConn");

//connect to mongoDB
connectDB();
//custom middleware logger

// app.use((req, res, next) => {
//   logEvents(`${req.method}\t${req.headers.origin}\t${req.url}`, "reqLog.txt");
//   console.log(`${req.method}\t${req.path}`);
//   next();
// }); we can write all this in log event from there we can export for the cleaner code

app.use(logger);

//cross origin resource sharing

app.use(cors(corsOptions));

app.use(express.urlencoded({ extended: false }));

app.use(express.json());

app.use(cookieParser());

app.use("/", express.static(path.join(__dirname, "/public"))); // this line also same  app.use(express.static(path.join(__dirname, "/public")));
app.use("/subdir", express.static(path.join(__dirname, "/public")));
//routes
app.use("/", require("./routes/root"));
app.use("/register", require("./routes/register"));
app.use("/auth", require("./routes/auth"));
app.use("/refresh", require("./routes/refresh"));
app.use("/logout", require("./routes/logout"));
app.use("/subdir", require("./routes/subdir"));
app.use(verifyJWT);
app.use("/employees", require("./routes/api/employees"));

// from line 47-60 instead of writing hear we can write by using express router. so, commenting this code here
// app.get("^/$|/index(.html)?", (req, res) => {
//   //1st way
//   //res.sendFile('./views/index.html',{root:__dirname});
//   //2nd way
//   res.sendFile(path.join(__dirname, "views", "index.html"));
// });

// app.get("/new-page(.html)?", (req, res) => {
//   res.sendFile(path.join(__dirname, "views", "new-page.html"));
// });

// app.get("/old-page(.html)?", (req, res) => {
//   res.redirect(301, "/new-page.html"); //by default status is 302 so adding 301
// });

//route handlers

// one way
// app.get(
//   "/hello(.html)?",
//   (req, res, next) => {
//     console.log("hello 1");
//     next(); //Next is kind of middleware which helps us to call another function
//   },
//   (req, res) => {
//     console.log("hello 2");
//     res.send("hello world using route handlers");
//   }
// );

// //another way

// const one = (req, res, next) => {
//   console.log("one");
//   next();
// };

// const two = (req, res, next) => {
//   console.log("two");
//   next();
// };

// const three = (req, res) => {
//   console.log("three");
//   res.send("This is the route handler function method to get the information");
// };

// app.get("/chain(.html)?", [one, two, three]);

// app.get("/*", (req, res) => {
//   res.status(404).sendFile(path.join(__dirname, "views", "404.html"));
// });

app.all("*", (req, res) => {
  res.status(404);
  if (req.accepts("html")) {
    res.sendFile(path.join(__dirname, "views", "404.html"));
  } else if (req.accepts("json")) {
    res.json({ status: 404, error: "404 not found" });
  } else {
    res.type("txt").send("404 not found");
  }
});

app.use(errorHandler);

mongoose.connection.once("open", () => {
  console.log("connected to mongoDB");
  app.listen(port, () => console.log("running the server", port));
});
