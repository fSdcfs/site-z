const express = require("express");
const HostRouter = express.Router();
const multer=require("../utils/multer");

const { getHome, getHost, postHost, getHostlist, postHostDelete } = require("../controller/hostController");

HostRouter.get("/", getHome);
HostRouter.get("/host", getHost);
HostRouter.post("/host",multer, postHost);
HostRouter.get("/host-list", getHostlist);
HostRouter.post("/delete/:itemId", postHostDelete);

module.exports = HostRouter;