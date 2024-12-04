const AnonymousModel = require("../models/Anonymous");

const createAnonymous = async (req, res) => {
	const { content } = req.body;
	if (!content) return res.status(400).json({ success: false });

	const data = await AnonymousModel.create({
		content,
	});

	res.status(200).json({
		success: true,
		data,
	});
};

const getAnonymous = async (req, res) => {
	const { id } = req.params;
	const data = await AnonymousModel.findById(id);

	if (!data)
		return res
			.status(404)
			.json({ success: false, message: "Anonymous user not found" });

	res.status(200).json({
		success: true,
		data,
	});
};

const getAllAnonymous = async (req, res) => {
	const data = await AnonymousModel.find();

	res.status(200).json({
		success: true,
		data,
	});
};

module.exports = { createAnonymous, getAnonymous, getAllAnonymous };
