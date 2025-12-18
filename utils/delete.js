const fs=require("fs");
const path=require("path");
const root=require("./pathUtil");

const deleteFile=(folder,filename,label='')=>{

  if(!filename) return
  const filePath=path.join(root,folder,filename);
  fs.unlink(filePath,err=>{
    if(err)
      console.log(`${label}delete error check utils detele file`)
  })
};


module.exports=deleteFile;