require("dotenv").config();
const path = require("path");
const express = require("express");

const app = express();

const { databaseConnection } = require("./services/mongooseService");

const start = async () => {
  try {
    await databaseConnection();
    console.log("Connected to Mongo");

    app.get("/", (req, res) => {
      console.log("request recieved on default route : " + new Date());
      res.send("Hello World!");
    });

    app.listen(process.env.APP_PORT, () => {
      console.log(`Example app listening on port ${process.env.APP_PORT}`);
    });
  } catch (error) {
    //TODO safe Stringify this with a try catch wrapper
    console.error("Database Connection Error :", error);
  }
};

start();
