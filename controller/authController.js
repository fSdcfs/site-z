
const {check,validationResult}=require("express-validator");
const bcrypt=require("bcryptjs");
const User=require("../model/User");
 

//login

exports.getLogin=(req,res,next)=>{
console.log("getlogin")
res.render("auth/login",{
  isLoggedIn:false,
  errors:[],
  oldInput: { firstname:"", lastname:"",  email:"",password:"", userType:"",terms :""},
        user: {}
})
};



exports.postLogin = (req, res, next) => {
  const { email, password } = req.body;

  User.findOne({ email })
    .then(user => {
      if (!user) {
        return res.status(422).render("auth/login", {
          isLoggedIn: false,
          errors: ["User not found"],
          oldInput: { email },
          user: {}
        });
      }

      return bcrypt.compare(password, user.password).then(isMatch => {
        if (!isMatch) {
          return res.status(422).render("auth/login", {
            isLoggedIn: false,
            errors: ["Invalid password"],
            oldInput: { email },
            user: {}
          });
        }

        req.session.isLoggedIn = true;
        req.session.user = user;
        req.session.save(err => {
          if (err) console.error("session save error:", err);
          res.redirect("/"); // redirect to home/dashboard
        });
      });
    })
    .catch(err => {
      console.error("error in post login", err);
      return res.status(500).render("auth/login", {
        isLoggedIn: false,
        errors: ["SOME ERROR ON SERVER SIDE !! TRY AGAIN LATER"],
        oldInput: { email },
        user: {}
      });
    });
};


//logout

exports.postLogout=(req,res,next)=>{
console.log("logout")
req.session.destroy(()=>{
  console.log("log out done ")
  res.redirect("/")
})
};

 


//sign in

exports.getSignin=(req,res,next)=>{
console.log("get signin")
res.render("auth/signin",{
  isLoggedIn:false,
  errors:[],
  oldInput: { firstname:"", lastname:"",  email:"",password:"", userType:"",terms :""},
        user: {}


})
};


exports.postSignin = [
  check("firstname")
    .isLength({ min: 2 }).withMessage("At least 2 characters")
    .matches(/^[A-Za-z]+$/).withMessage("Only letters")
    .trim(),
  check("lastname")
    .optional()
    .matches(/^[A-Za-z]+$/).withMessage("Only letters"),
  check("email")
    .isEmail().withMessage("Enter a valid email"),
  check("password")
    .isLength({ min: 8 }).withMessage("At least 8 characters")
    .matches(/[A-Z]/).withMessage("Should have 1 uppercase letter")
    .matches(/[a-z]/).withMessage("Should have 1 lowercase letter")
    .matches(/[0-9]/).withMessage("Should have 1 number")
    .matches(/[!@#$%^&()<>?+\-]/).withMessage("Should have 1 special character")
    .trim(),
  check("confirmPassword")
    .custom((value, { req }) => value === req.body.password)
    .withMessage("Passwords do not match"),
  check("userType")
    .notEmpty()
    .isIn(["guest", "host"])
    .withMessage("Choose a user type to proceed"),
  check("terms")
    .equals("on")
    .withMessage("Please agree to the terms"),

  (req, res, next) => {
    const { firstname, lastname, email, password, userType } = req.body;
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).render("auth/signin", {
        isLoggedIn: false,
        errors: errors.array().map(err => err.msg),
        oldInput: req.body,
        user: {}
      });
    }

    bcrypt.hash(password, 12)
      .then(hashedPassword => {
        const newUser = new User({
          firstname,
          lastname,
          email,
          password: hashedPassword,
          userType
        });
        return newUser.save();
      })
      .then(() => {
        res.redirect("/login");
      })
      .catch(err => {
        console.error("error in post signin", err);
        return res.status(500).render("auth/signin", {
          isLoggedIn: false,
          errors: ["SOME ERROR ON SERVER SIDE !! TRY AGAIN LATER"],
          oldInput: req.body,
          user: {}
        });
      });
  }
];