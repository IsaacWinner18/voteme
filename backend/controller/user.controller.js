// const createUser = async (req, res) => {
//   return res.status(201).json({
//     success: true,
//     data: {
//       id: req.id,
//     },
//   });
// };
const ParticipantModel = require("../models/Groups");

const createUser = async (req, res) => {
  const { name } = req.body;
  const user = await ParticipantModel.create({
    name,
  });

  return res.status(201).json({
    success: true,
    data: user,
  });
};

const getUsers = async (req, res) => {
  const users = await ParticipantModel.find().populate("votes");
  return res.status(200).json({
    success: true,
    data: users,
  });
};

const voteUser = async (req, res) => {
  const { id: userId } = req.params;
  const user = await ParticipantModel.findByIdAndUpdate(
    userId,
    {
      $inc: { votes: 1 },
    },
    { new: true }
  );

  console.log(user);

  return res.status(200).json({
    success: true,
    data: user,
  });
};

// const deleteUser = async (req, res) => {
//   return res.status(204);
// };

module.exports = { getUsers, createUser, voteUser };
