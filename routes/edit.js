const express = require("express");
const EditRouter = express.Router();
const multer=require("../utils/multer");

// Import controller functions
const { getEdit, postEdit } = require("../controller/hostController");

// Routes
EditRouter.get("/edit/:itemId", getEdit);
EditRouter.post("/edit",multer, postEdit);

module.exports = EditRouter;