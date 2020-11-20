// jshint esversion: 6
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");




const app = express();
app.use(express.static("public"));
app.set("view engine", 'ejs');
app.use(bodyParser.urlencoded({extended: true}));

mongoose.connect("mongodb://localhost:27017/mysteryDB", {useNewUrlParser: true, useUnifiedTopology: true}, function(err) {
    if(err)
    {
        console.log(err);
    }
    else
    {
        console.log("database connection successfull!");
    }
});

const userSchema = new mongoose.Schema({
    email: String,
    password: String,
});

// console.log("SCHEMA OPTIONS:", userSchema.options);
userSchema.plugin(encrypt, {secret: process.env.SECRET, encryptedFields: ['password']});


const User = mongoose.model("User", userSchema);
console.log(process.env.API_KEY);


app.listen(3000, (req, res) => {
    console.log("server is tuned on 3000");
});

app.get("/", (req, res) => {

    res.render("home" , {});
});

app.get("/register", (req, res) => {
  res.render("register", {});  
});

app.post("/register", (req, res) => {
    var username = req.body.username;
    var password = req.body.password;

    const user1 = new User({
        email:    req.body.username,
        password: req.body.password,

    });

    user1.save(function(err) {
        if(!err)
        {
            res.render("secrets", {});
        }
    });
});

app.get("/login", (req, res) => {

    res.render("login", {});
});

app.post("/login", (req, res) => {
    var username = req.body.username;
    var password = req.body.password;
    
    User.findOne({email: username}, function(err, foundUser) {
        if(err)
        {
            console.log(err);
        }
        else
        {
            if(foundUser)
            {
                if(foundUser.password === password)
                {
                    console.log(foundUser.password);
                    res.render("secrets", {});
                }
            }
        }
    });
});









