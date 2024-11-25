// const createUser = async (req, res) => {
//   return res.status(201).json({
//     success: true,
//     data: {
//       id: req.id,
//     },
//   });
// };
const config = require("../config");
const ParticipantModel = require("../models/Groups");
const userModel = require("../models/user");
const nodemailer = require("nodemailer");

let transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "oritsegbe2001@gmail.com",
    pass: "oied dxon empf rbab",
  },
  host: "smtp.gmail.com",
  port: 465,
});

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
  const {
    cookies: { blob: activeUserId },
    params: { id: userId },
  } = req;
  const user = await ParticipantModel.findById(userId);

  if (!user) {
    res.clearCookie();
    throw new Error("Invalid user");
  }
  if (user.votes.includes(activeUserId))
    throw new Error("You've already voted for this participant.");

  if (await ParticipantModel.findOne({ votes: activeUserId }))
    throw new Error("You've already voted for someone else.");

  user.votes.push(activeUserId);
  user.save();

  return res.status(200).json({
    success: true,
    data: user,
  });
};

const login = async (req, res) => {
  // get email
  // store email on db
  // send code to email (there should be a send again and edit email btns)
  // verify the code
  const userEmail = req.body.email;
  const userCode = generateCode(4);
  const userExist = await userModel.findOne({ email: userEmail });

  if (userExist && userExist.verified)
    throw new Error("User is already verified.");

  if (userExist) {
    sendCode(userEmail, userCode);
    await userModel.findOneAndUpdate({ email: userEmail }, { code: userCode });
  } else {
    await userModel.create({
      email: userEmail,
      code: userCode,
    });
    sendCode(userEmail, userCode);
  }

  return res.status(201).json({
    success: true,
  });
};

const logout = async (req, res) => {
  res.clearCookie();
  return res.status(204).json({});
};
const generateCode = (length) => {
  let code = "";
  for (let i = 0; i < length; i++) {
    code += Math.floor(Math.random() * 10);
  }
  return code;
};

const sendCode = (userMail, algoCode) => {
  console.log("SENDING CODE....");
  transporter.sendMail({
    from: "oritsegbe2001@gmail.com",
    to: userMail,
    subject: "Verification Code",
    text: algoCode,
  });
};

const resendCode = async (req, res) => {
  const { email } = req.body;
  const user = await userModel.findOne({ email });

  if (!user) throw new Error("User does not exist.");
  if (user.verified) throw new Error("User is already verified.");

  const code = generateCode(4);
  await userModel.findOneAndUpdate({ email }, { code });

  sendCode(email, code);

  return res.status(200).json({
    success: true,
  });
};

const verifyCode = async (req, res) => {
  const { email, code } = req.body;

  const user = await userModel.findOne({ email });
  if (user) {
    if (user.verified) throw new Error("User is already verified.");
    if (Number(user.code) === code) {
      await userModel.findOneAndUpdate(
        {
          email,
        },
        { verified: true, code: null }
      );

      return res
        .status(200)
        .cookie("blob", user._id, {
          httpOnly: true,
          secure: config.NODE_ENV !== "development" ? true : false,
          sameSite: config.NODE_ENV !== "development" ? "none" : "lax",
          maxAge: 2592000, // 30 days
        })
        .json({
          success: true,
          user,
        });
    } else {
      throw Error("Invalid code provided");
    }
  } else {
    throw Error("User does not exist");
  }
};

const getUser = async (req, res) => {
  const { blob } = req.cookies;

  const user = await userModel.findById(blob);
  console.log(user);

  return res.status(200).json({
    success: true,
    user,
  });
};

// const deleteUser = async (req, res) => {
//   return res.status(204);
// };

module.exports = {
  getUsers,
  createUser,
  voteUser,
  login,
  logout,
  verifyCode,
  resendCode,
  getUser,
};
