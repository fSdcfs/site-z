const  express=require("express");
const sendfileRouter=express.Router();
const { getdownload, getInlineview }=require("../controller/fileView");

//inline view

sendfileRouter.get("/productView/:itemId",getInlineview);

//download file
sendfileRouter.get("/productDownload/:itemId",getdownload);



module.exports=sendfileRouter;