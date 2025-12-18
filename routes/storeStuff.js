const  express=require("express");
const storeRouter=express.Router();
const { getStore, getDetails, getBooking, postBooking, postBookingdelete }=require("../controller/storeController");

//store

storeRouter.get("/store",getStore);

//details

storeRouter.get("/details/:productId",getDetails);

//booking

storeRouter.get("/book",getBooking);

storeRouter.post("/book",postBooking);

//booking delete
storeRouter.post("/book/delete/:itemId",postBookingdelete);



module.exports=storeRouter;