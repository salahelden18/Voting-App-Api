const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  department: {
    type: String,
    required: [true, "department field if required"],
  },
  email: {
    type: String,
    validate: [validator.isEmail, "Please Enter a Valid Email"],
    required: [true, "User Email is Required"],
    unique: [true, "This email already in use"],
    trim: true,
  },
  gpa: {
    type: Number,
    min: [0, "your gpa must be above 0"],
    max: [4, "your gpa must be below or equal to 4"],
    default: 2,
  },
  grade: {
    type: Number,
    min: [0, "your gpa must be above 0"],
    max: [4, "your gpa must be below or equal to 4"],
    default: 2,
  },
  isCandidate: {
    type: Boolean,
    default: false,
  },
  name: {
    type: String,
    required: [true, "Your name is required"],
    trim: true,
  },
  previousRes: {
    type: String,
    default: "previous reasons",
  },
  repReansons: {
    type: String,
    default: "representative reasons",
  },
  voted: {
    type: Boolean,
    default: false,
  },
  votes: {
    type: Number,
    defualt: 0,
  },
  password: {
    type: String,
    required: [true, "Enter Your Password"],
    minLenght: [7, "Your password must be atleast 7 characters"],
    select: false,
  },
  role: {
    type: String,
    default: "user",
    enum: {
      values: ["user", "admin"],
      message: "the entered value is out of range",
    },
  },
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 12);

  next();
});

userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

const User = mongoose.model("User", userSchema);

module.exports = User;
