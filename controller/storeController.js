
const Product=require("../model/Product");
const User=require("../model/User");


//store

exports.getStore = (req, res, next) => {
  console.log("store");

  // Get page number from query string, default to 1
  const page = parseInt(req.query.page) || 1;
  const limit = 6; // number of products per page
  const skip = (page - 1) * limit;

  // Count total products for pagination
  Product.countDocuments()
    .then(count => {
      return Product.find()
        .skip(skip)
        .limit(limit)
        .then(products => {
          res.render("store/store", {
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


//details

exports.getDetails=(req,res,next)=>{
console.log("details")
const productId=req.params.productId;
console.log("came to details of :",productId)
Product.findById(productId)
.then(product=>{
  res.render("store/details",{
    item:product,
    isLoggedIn:req.isLoggedIn,
 user:req.session.user,
  })
})

};



//booking  OR cart


exports.getBooking = (req, res, next) => {
  console.log("get book");
  const userId = req.session.user._id;

  User.findById(userId)
    .populate("Book")
    .then(user => {
      if (!user) {
        return res.redirect("/login");
      }

      // Calculate total amount
      const totalAmount = user.Book.reduce((sum, item) => sum + item.price, 0);

      res.render("store/book", {
        Book: user.Book,
        isLoggedIn: req.isLoggedIn,
        user: req.session.user,
        totalAmount
      });
    })
    .catch(err => {
      console.error("Error in getBooking", err);
      res.status(500).render("store/book", {
        Book: [],
        isLoggedIn: req.isLoggedIn,
        user: req.session.user,
        errors: ["Could not load bookings"],
        totalAmount: 0
      });
    });
};


exports.postBooking = (req, res, next) => {
  console.log("post book");
  const userId = req.session.user._id;
  const productId = req.body.productId;

  User.findById(userId)
    .then(user => {
      if (!user) {
        return res.redirect("/login");
      }

      // Avoid duplicates
      if (!user.Book.includes(productId)) {
        user.Book.push(productId);
        return user.save();
      }
    })
    .then(() => {
      res.redirect("/store");
    })
    .catch(err => {
      console.error("Error in postBooking", err);
      res.redirect("/store");
    });
};



//remove Booking 

exports.postBookingdelete = (req, res, next) => {
  console.log("book remove");
  const itemId = req.params.itemId;
  const userId = req.session.user._id;

  User.findById(userId)
    .then(user => {
      if (!user) {
        return res.redirect("/login");
      }

      // Remove the item from Book array
      user.Book = user.Book.filter(prodId => prodId.toString() !== itemId.toString());

      return user.save();
    })
    .then(() => {
      res.redirect("/book"); // redirect back to booking list
    })
    .catch(err => {
      console.error("Error in postBookingdelete", err);
      res.status(500).redirect("/book");
    });
};



