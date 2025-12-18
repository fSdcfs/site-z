const express = require("express");
const body = require("body-parser");
const session = require("express-session");
const mongoose = require("mongoose");
const path=require("path");
const root=require("./utils/pathUtil");
const MongoDbStore = require("connect-mongodb-session")(session);

require("dotenv").config();

const app = express();

// Middleware
app.use(body.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.set("views", "views");

// Session setup
const store = new MongoDbStore({
  uri: process.env.C,
  collection: "sessions"
});

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    store: store
  })
);




// AUTH STUFF

app.use((req,res,next)=>{
  req.isLoggedIn=req.session.isLoggedIn;
  next();
});


app.use("/host",(req,res,next)=>{
if(req.session.isLoggedIn){
  return next()
}else{
  res.redirect("/login")
}

});



// connection 
app.use("/images", express.static(path.join(__dirname, "images")));
app.use(express.static(path.join(__dirname, "views")));
// ALL ROUTES 

const HostRouter=require("./routes/host");
const EditRouter = require("./routes/edit");
const storeRouter = require("./routes/storeStuff");
const authRouter = require("./routes/Auth");
const sendfileRouter = require("./routes/fileStuff");
app.use(HostRouter);
app.use("/host",EditRouter);
app.use(storeRouter);
app.use(authRouter);
app.use(sendfileRouter);









// Connect to MongoDB
mongoose.connect(process.env.C)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(process.env.PORT || 3000, () => {
      console.log(`Server running on http://localhost:${process.env.PORT || 3000}`);
    });
  })
  .catch(err => console.error("MongoDB connection failed:", err));