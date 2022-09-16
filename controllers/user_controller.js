const User = require("../models/user_model");
const jwt = require("jsonwebtoken");
const util = require("util");
const CreateError = require("../utils/error_handle");
const catchAsync = require("../utils/catchAsync");

const createSendToken = (user, statusCode, res) => {
  const token = jwt.sign(
    {
      id: user.id,
    },
    process.env.TOKEN_SECRET
  );

  user.password = undefined;

  res.status(statusCode).json({
    status: "success",
    data: {
      user,
    },
    token,
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  const user = await User.create(req.body);

  createSendToken(user, 201, res);
});

exports.signin = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new CreateError(400, "Please Provide Email And Password"));
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new CreateError(401, "Incorrect Email Or Password"));
  }

  createSendToken(user, 200, res);
});

exports.protect = catchAsync(async (req, res, next) => {
  let token;

  if (req.header("auth_token")) {
    token = req.header("auth_token");
  }

  if (!token) {
    return next(
      new CreateError(401, "You are not logged in! Please login to get access")
    );
  }

  // cerification token
  const decoded = await util.promisify(jwt.verify)(
    token,
    process.env.TOKEN_SECRET
  );

  const currentUser = await User.findById(decoded.id);

  if (!currentUser) {
    return next(
      new CreateError(
        401,
        "the user belonging to this token does no longer exist"
      )
    );
  }

  req.user = currentUser;
  next();
});

exports.restrictTo =
  (...roles) =>
  (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      next(
        new CreateError(
          403,
          "You don not have permission to perform this action"
        )
      );
    }
    next();
  };

exports.updateUser = catchAsync(async (req, res, next) => {
  const updatedUser = await User.findByIdAndUpdate(req.user._id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!updatedUser) {
    return next(
      new CreateError(
        404,
        "The user does not exist! please try to login or signup"
      )
    );
  }

  res.status(200).json({
    status: "success",
    data: {
      user: updatedUser,
    },
  });
});

exports.updateUserById = catchAsync(async (req, res, next) => {
  const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!updatedUser) {
    return next(
      new CreateError(
        404,
        "The user does not exist! please try to login or signup"
      )
    );
  }

  res.status(200).json({
    status: "success",
    data: {
      user: updatedUser,
    },
  });
});

exports.deleteUser = catchAsync(async (req, res, next) => {
  const deletedUser = await User.findByIdAndDelete(req.params.id);

  if (!deletedUser) {
    return next(new CreateError(404, "The user does not exist"));
  }

  res.status(200).json({
    status: "success",
    data: null,
  });
});

exports.getUser = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  if (!user) {
    return next(new CreateError(404, "Please Log in"));
  }

  res.status(200).json({
    status: "success",
    data: {
      user,
    },
  });
});

exports.getCandidatesList = catchAsync(async (req, res, next) => {
  const users = await User.find()
    .where("department")
    .equals(req.user.department)
    .where("isCandidate")
    .equals(true)
    .sort("-votes");

  res.status(200).json({
    status: "success",
    results: users.length,
    data: {
      users,
    },
  });
});
