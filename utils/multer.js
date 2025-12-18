
const Multer=require("multer");
const path=require("path");
const root=require("./pathUtil");
const random = require("./random");
const fs=require('fs');

const imagesDir = path.join(root, "images");
if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir, { recursive: true });
}


const storage=Multer.diskStorage({
  destination:(req,file,cb)=>{
    cb(null,path.join(root,"images"));
  },
  filename:(req,file,cb)=>{
    cb(null,random(10)+'-'+file.originalname)
  }
});

const fileFilter=(req,file,cb)=>{
  const allowed=["image/png","image/jpeg"];
  cb(null,allowed.includes(file.mimetype));

}


module.exports = Multer({ storage, fileFilter }).single("image");

