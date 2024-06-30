import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const generateAccessAndRefereshToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;

    await user.save({ validateBeforeSave: false });
    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while generating referesh and access token"
    );
  }
};

// ****************** Register USer ********************//
const registerUser = asyncHandler(async (req, res) => {
  // step 1 get user details from frontend
  // validation - not empty
  // check user allready exists : username & email
  // check for img & avatar
  // upload them to cloudinary
  // create user object - create entry in db
  // remove password and refres token field from respons
  // check for user creation
  // return res

  const { fullName, email, userName, password } = req.body;

  // if (fullName === "") {
  //     throw new ApiError(400,'fullname is required')
  // }

  if (
    [fullName, email, userName, password].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "all fields are required !");
  }

  const existedUser = await User.findOne({
    $or: [{ userName }, { email }],
  });

  // console.log(existedUser)

  if (existedUser) {
    throw new ApiError(409, "user with email or username already exists");
  }

  console.log(req.files);
  const avatarlocalPath = req.files?.avatar[0]?.path;
  // const coverImageLocalPath = req.files?.coverImage[0]?.path;

  let coverImageLocalPath;

  if (
    req.files &&
    Array.isArray(req.files.coverImage) &&
    req.files.coverImage.lenght > 0
  ) {
    coverImageLocalPath = req.files.coverImage[0].path;
  }

  if (!avatarlocalPath) {
    throw new ApiError(400, "Avatar file is required");
  }

  const avatar = await uploadOnCloudinary(avatarlocalPath);
  const coverImage = await uploadOnCloudinary(coverImageLocalPath);

  if (!avatar) {
    throw new ApiError(400, "Avatar file is required");
  }

  const user = await User.create({
    fullName,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
    email,
    password,
    userName: userName.toLowerCase(),
  });

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering the user");
  }

  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "user register successfully"));
});

// ******************Log in User**********************//

const loginUser = asyncHandler(async (req, res) => {
  // req.body -> data
  // username or email
  // find user
  // check password
  // access and referesh tocken
  // send cookies

  const { email, userName, password } = req.body;

  if (!userName || !email) {
    throw new ApiError(400, "username or email is required");
  }

  const user = await User.findOne({
    $or: [{ userName }, { email }],
  });

  if (!user) {
    throw new ApiError(400, "User does not exist");
  }

  const isPasswordValid = await user.isPasswordCorrect(password);

  if (!isPasswordValid) {
    throw new ApiError(400, "Invalid user crendentials");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefereshToken(
    user._id
  );

  const loggedInUser = User.findById(user._id).select(
    "-password -refreshToken"
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInUser,
          accessToken,
          refreshToken,
        },
        "User logged in successfully"
      )
    );
});

const LogOutUser = asyncHandler(async (req, res) => {
  //
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        refreshToken: undefined,
      },
    },
    {
      new: true,
    }
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .clearCoookie("accessToken", accessToken, options)
    .clearCoookie("refershToken", refreshToken, options)
    .json(new ApiResponse(200, {}, "User Logged Out"));
});

export { registerUser, loginUser, LogOutUser };
