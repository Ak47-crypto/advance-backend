import { User } from "../models/user.model.js";
import { apiResponse } from "../utils/apiResponse.js";
import { apiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { handleCloudinary } from "../utils/cloudinary.js";

// function for generating tokens
const accessTokenAndRefreshToken = async (user) => {
  const accessToken = user.accessTokenMethod();
  const refreshToken = user.refreshTokenMethod();
  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });
  return { accessToken, refreshToken };
};

const registerUser = asyncHandler(async (req, res, next) => {
  //upload the information like email,password,images etc
  //validation of email etc
  //check if user already exist or not
  //file or images processing on cloudinary

  const { fullName, email, password, username } = req.body;
  //validation
  if (
    [fullName, email, username, password].some((field) => field?.trim() === "")
  ) {
    // return res.status(400).json({error:"field can not be empty"})
    throw new apiError(400, "field can not be empty");
  }
  const existed = await User.findOne({
    $or: [{ email }, { username }],
  });
  if (existed)
    throw new apiError(400, "user already existed with given details");

  if (!req.files.avatar) throw new apiError(400, "avatar is required");

  const localAvatarPath = req.files?.avatar[0]?.path;

  let localCoverImagePath;
  let coverimage = null;
  if (req.files.coverimage) {
    localCoverImagePath = req.files?.coverimage[0].path;
    coverimage = await handleCloudinary(localCoverImagePath);
  }
  const avatar = await handleCloudinary(localAvatarPath);

  const user = await User.create({
    fullName,
    email,
    username: username.toLowerCase(),
    password,
    avatar: avatar,
    coverimage: coverimage,
  });
  const data = await User.findById(user._id).select("-password -refreshToken");
  res.status(201).json(new apiResponse(200, data, "success"));
});

// login
const login = asyncHandler(async (req, res, next) => {
  // user enter username or email (providing access with both)
  // check against the entered username and email if user already exist or not
  // check password is correct or not
  // generate accesstoken and refreshtoken
  // send cookies and save refreshtoken in user db

  const { email, password, username } = req.body;
  let user;
  if (username || email) {
    user = await User.findOne({
      $or: [{ username }, { email }],
    });
    if (!user) throw new apiError(400, "Invalid credentials");
  } else throw new apiError(400, "Invalid credentials");
  const checkPassword = await user.checkPassword(password);
  if (!checkPassword) throw new apiError(400, "Invalid credentials");
  const { accessToken, refreshToken } = await accessTokenAndRefreshToken(user);
  const options = {
    httpOnly: true,
    secure: true,
  };
  user.password = null;
  user.refreshToken = null;
  res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(new apiResponse(200, { user: user }, "Logged in successfully"));
});

// logout
const logout = asyncHandler(async (req, res) => {
  const options = {
    httpOnly: true,
    secure: true,
  };
  await User.findByIdAndUpdate(
    req.user._id,
    {
      refreshToken: undefined,
    },
    {
      new: true,
    }
  );
  res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new apiResponse(200, {}, "Logged out successfully"));
});

export { registerUser, login, logout };
