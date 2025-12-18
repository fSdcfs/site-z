const  express=require("express");
const authRouter=express.Router();
const { getLogin, postLogin, postLogout, getSignin, postSignin }=require("../controller/authController");

//login 

authRouter.get("/login",getLogin);

authRouter.post("/login",postLogin);



//logout

authRouter.post("/logout",postLogout);

//sign in

authRouter.get("/signin",getSignin);

authRouter.post("/signin",postSignin);


module.exports=authRouter;