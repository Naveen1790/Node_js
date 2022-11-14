const express = require("express");
const app = express();
const path = require("path");
const port = process.env.PORT || 3500;
const { logger } = require("./middleware/logEvents");

const errorHandler = require("./middleware/errorHandler");
const cors = require("cors");
//custom middleware logger

// app.use((req, res, next) => {
//   logEvents(`${req.method}\t${req.headers.origin}\t${req.url}`, "reqLog.txt");
//   console.log(`${req.method}\t${req.path}`);
//   next();
// }); we can write all this in log event from there we can export for the cleaner code

app.use(logger);

//cross origin resource sharing
const whiteList = [
  "https://www.yoursList.com",
  "127.0.0.1:3000",
  "http://localhost:3500",
];

const corsOptions = {
  origin: (origin, callback) => {
    if (whiteList.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

// app.use(cors());

app.use(express.static(path.join(__dirname, "/public")));

app.get("^/$|/index(.html)?", (req, res) => {
  //1st way
  //res.sendFile('./views/index.html',{root:__dirname});
  //2nd way
  res.sendFile(path.join(__dirname, "views", "index.html"));
});

app.get("/new-page(.html)?", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "new-page.html"));
});

app.get("/old-page(.html)?", (req, res) => {
  res.redirect(301, "/new-page.html"); //by default status is 302 so adding 301
});

//route handlers

// one way
app.get(
  "/hello(.html)?",
  (req, res, next) => {
    console.log("hello 1");
    next(); //Next is kind of middleware which helps us to call another function
  },
  (req, res) => {
    console.log("hello 2");
    res.send("hello world using route handlers");
  }
);

//another way

const one = (req, res, next) => {
  console.log("one");
  next();
};

const two = (req, res, next) => {
  console.log("two");
  next();
};

const three = (req, res) => {
  console.log("three");
  res.send("This is the route handler function method to get the information");
};

app.get("/chain(.html)?", [one, two, three]);

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

app.listen(port, () => console.log("running the server", port));
