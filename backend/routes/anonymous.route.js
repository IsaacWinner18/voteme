const express = require("express");
const {
	getAnonymous,
	getAllAnonymous,
	createAnonymous,
} = require("../controller/anonymous.controller");
const AnonymousRouter = express.Router();

AnonymousRouter.get("/anon/:id", getAnonymous);
AnonymousRouter.route("/anon").get(getAllAnonymous).post(createAnonymous);

module.exports = AnonymousRouter;
