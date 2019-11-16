const express = require("express");
const users = express.Router();
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const docClient = require("../db");

//const User = require("../models/Users");
users.use(cors());

process.env.SECRET_KEY = "secret";

/*
users.post("/register", (req, res) => {
  const today = new Date();
  const userData = {
    username: req.body.username,
    password: req.body.password,
    privilege: req.body.privilege,
    created: today
  };

  User.findOne({
    where: {
      username: req.body.username
    }
  })
    .then(user => {
      if (!user) {
        bcrypt.hash(req.body.password, 10, (err, hash) => {
          userData.password = hash;
          User.create(userData)
            .then(user => {
              let token = jwt.sign(user.dataValues, process.env.SECRET_KEY, {
                expiresIn: 1200
              });
              res.json({ token: token, status: user.username + "Registered!" });
            })
            .catch(err => {
              res.send("error: " + err);
            });
        });
      } else {
        res.json({ error: "User already exists" });
      }
    })
    .catch(err => {
      res.send("error: " + err);
    });
}); */

users.post("/login", (req, res) => {
  let params = {};
  params.TableName = "hotel";
  params.Key = { hotelid: 1 };
  params.ProjectionExpression = "rooms";

  docClient.get(params, (err, data) => {
    if (err) {
      console.log(err);
    } else {
      console.log(data.Item.rooms.length);
      console.log(data.Item.rooms.length);
      for (let i = 0; i < data.Item.rooms.length; i++) {
        console.log(data.Item.rooms[i]);
        if (data.Item.rooms[i].roomNum === req.body.username) {
          console.log(data.Item.rooms[i].roomNum === req.body.username);
          if (
            bcrypt.compareSync(req.body.password, data.Item.rooms[i].password)
          ) {
            const token = jwt.sign(
              { roomNum: data.Item.rooms[i].roomNum },
              process.env.SECRET_KEY,
              {
                expiresIn: 1440
              }
            );
            console.log("login success");
            res.send(token);
          } else {
            res.send("incorrect username or password");
          }
          break;
        }
      }
    }
  });

  /*
  User.findOne({
    where: {
      username: req.body.username
    }
  })
    .then(user => {
      if (user) {
        if (bcrypt.compareSync(req.body.password, user.password)) {
          let token = jwt.sign(user.dataValues, process.env.SECRET_KEY, {
            expiresIn: 1440
          });
          res.send(token);
        }
      } else {
        res.status(400).json({ error: "User does not exist" });
      }
    })
    .catch(err => {
      res.status(400).json({ error: err });
    });
    */
});

users.get("/profile", (req, res) => {
  var decoded = jwt.verify(
    req.headers["authorization"],
    process.env.SECRET_KEY
  );

  /*
  User.findOne({
    where: {
      id: decoded.username
    }
  })
    .then(user => {
      if (user) {
        res.json(user);
      } else {
        res.send("User does not exist");
      }
    })
    .catch(err => {
      res.send("error: " + err);
    });
    */
});

module.exports = users;
