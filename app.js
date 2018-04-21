var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser')
var passport=require("passport");
var LocalStrategy=require("passport-local").Strategy;
var passportLocalMongoose=require("passport-local-mongoose");
var mongo = require('mongodb');
var path=require('path');
var ejs= require("ejs");
var LocalStrategy=require("passport-local").Strategy;

var User = require("./models/userSchema");


var session = require('express-session');
mongoose.connect("mongodb://localhost/chat");


//express app
var app= express();

//body parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//view enjine
app.set('view engine','ejs');

//sessions
 app.use(passport.initialize());
 app.use(passport.session());

//static files
app.use(express.static(path.join(__dirname,'public')));

app.use(require("express-session")({
    secret: "cat",
    resave:false,
    saveUninitialized:false
    }));

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  
  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });


//home page
app.get('/', function(req, res){
	res.render("home");
})


app.get("/register",function(req,res){
    res.render("register");
});



//register method
  app.post("/register",function(req,res){
      
    // req.body.username
    // req.body.password

    User.register(new User({
        firstname: req.body.firstname,
       lastname: req.body.lastname,
       username: req.body.username
    
    }), req.body.password, function(err, user){

        if (err) {
      console.log('error while user register!', err);
     // return next(err);
    }
        else{
            res.render("login");
        }
  });
});

// login
//get method
app.get("/login",function(req,res)
{
    res.render("login");
})


app.get("/afterlogin",function(req,res){
    res.render("afterlogin")
})

app.post("/login",passport.authenticate("local",{
  successRedirect: "/afterlogin",
  failureRedirect: "/login"
}) ,function(req,res){

});

//send message
app.get("/sendmessage",function(req,res)
{
    res.render("sendmessage");
})

app.get("/inbox",function(req,res){




   User.findOne({_id:req.session.passport.user},function(err,user)
{
    res.render("inbox",{
        messages:user.inbox,
    })
       
       
})
})


//block
app.get("/block", function(req,res){
  res.render("block");
})

app.post("/block",function(req,res){

User.findOne({_id:req.session.passport.user},function(err,user)
{
  
    user.blocklist.push(req.body.username);
    user.save();
       
       
})

res.redirect("/block/"+req.body.username);
})


app.get("/block/:id",function(req,res){
  

 User.findOne({_id:req.session.passport.user},function(err,user)
{
  // console.log(user);
    res.render("blocklist",{
      list:user.blocklist,
    })
       
       
})

})

//logout
app.post("/sendmessage",function(req,res)

{
  var var1,flag=0;
    User.findOne({_id: req.session.passport.user}, function(err, user){
      var1 = user.username;
          })

User.findOne({username:req.body.to}, function(err, user){
     console.log(var1);
     console.log(user.blocklist);
          for(var i=0;i<user.blocklist.length;i++){


if(var1==="user.blocklist[i]"){
            flag=1;
}

          }



          })

console.log(flag);
if(flag==1){
  
  res.render("notallowed");
}

 else{
 
 User.findOne({username: req.body.to },function(err, user){
      
     var mess = { from: var1, message: req.body.message };
     
     user.inbox.push(mess);
user.save();
     // console.log(req.session);
          })
 }
 res.render("afterlogin");
})
""
app.get("/logout",function(req,res){
  //req.session.logout();
  res.redirect("/");
})

//hosting
app.listen(3080,function(){
    console.log("3080");
})
