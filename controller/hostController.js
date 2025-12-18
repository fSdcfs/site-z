const Product=require("../model/Product");
const deleteFile=require("../utils/delete");

//home

exports.getHome = (req, res, next) => {
  console.log("home-page");
  res.render("home", {
    isLoggedIn:req.isLoggedIn,
 user:req.session.user,
  });
};

//host add
exports.getHost = (req, res, next) => {
  console.log("get -host");
  res.render("host/edit", {
    editing:false,
    isLoggedIn:req.isLoggedIn,
 user:req.session.user,
  });
};

exports.postHost = (req, res, next) => {
  console.log("post-host", req.body);
  const {name, price,category}=req.body
  const image=req.file?.filename||null;
  const newProduct=new Product({
    name, price,category,image
  });
 newProduct.save()
 .then(()=>{
  res.redirect("/store")
 })
 .catch(err=>{
  console.log("error in post host",err)
 })




};


//host list
exports.getHostlist = (req, res, next) => {
  console.log("host-list");

  const page = parseInt(req.query.page) || 1;
  const limit = 6; // products per page
  const skip = (page - 1) * limit;

  Product.countDocuments()
    .then(count => {
      return Product.find()
        .skip(skip)
        .limit(limit)
        .then(products => {
          res.render("host/host-list", {
            product: products,
            currentPage: page,
            hasNextPage: limit * page < count,
            hasPrevPage: page > 1,
            nextPage: page + 1,
            prevPage: page - 1,
            lastPage: Math.ceil(count / limit),
            isLoggedIn:req.isLoggedIn,
 user:req.session.user,
          });
        });
    })
    .catch(err => console.log(err));
};


//host delte
exports.postHostDelete = (req, res, next) => {
  console.log("host delete");
  const itemId = req.params.itemId;
  console.log("came to delete host :", itemId);

  Product.findById(itemId)
    .then(product => {
      if (product && product.image) {
        // Pass the actual filename string
        deleteFile("images", product.image);
      }
      return Product.findByIdAndDelete(itemId);
    })
    .then(() => {
      console.log("delete done")
      res.redirect("/host-list");
    })
    .catch(err => {
      console.log("error in post host delete:", err);
    });
};


//edit
exports.getEdit = (req, res, next) => {
  console.log("get edit");
  const itemId=req.params.itemId;
  const editing=req.query.editing === 'true'
  console.log("came to edit :",itemId,editing)
  Product.findById(itemId)
  .then(product=>{
    if(!product){
      console.log("error in edit ")
      res.redirect("/host-list")
    }else{
      res.render("host/edit",{
        editing:editing,
        item:product,
        isLoggedIn:req.isLoggedIn,
 user:req.session.user,
      })
    }
    
  })
 

  
};

exports.postEdit = (req, res, next) => {
  console.log("post edit");

  const { name, price, category, _id } = req.body;

  Product.findById(_id)
    .then(product => {
      if (!product) {
        return res.redirect("/host-list");
      }

      // Update fields
      product.name = name;
      product.price = price;
      product.category = category;

      // Handle new image upload
      if (req.file) {
        // delete old image if exists
        if (product.image) {
          deleteFile("images", product.image);
        }
        product.image = req.file.filename;
      }

      return product.save();
    })
    .then(() => {
      console.log("edit done:")
      res.redirect("/host-list");
    })
    .catch(err => {
      console.log("error in post edit:", err);
      res.redirect("/host-list");
    });
  };