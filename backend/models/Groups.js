const mongoose = require("mongoose");
const { user } = require("./user");

const ParticipantSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  votes: [{ type: mongoose.Schema.Types.ObjectId, ref: "users" }],
  image: {
    type: String,
    default: "https://placehold.co/600x400",
  },
});

const Participant = new mongoose.model("Participant", ParticipantSchema);

// const Groups = new mongoose.Schema({
//   name: {
//     type: String,
//     required: true
//   },
//   participants: {
//     type: [Participant],
//     default: []
//   },
//   total_votes: {
//     type: Number
//   }
// });

// const GroupSchema = mongoose.model("Groups", Groups);
// module.exports = GroupSchema;

module.exports = Participant;
