import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from '../utils/ApiError.js';
import { User } from '../models/user.model.js';
import { uploadOnCloudinary } from '../utils/cloudinary.js';
import { ApiResponse } from "../utils/ApiResponse.js";

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
        throw new ApiError(400, 'all fields are required !')
    }

    const existedUser = User.findOne({
        $or: [{ userName }, { email }]
    });

    console.log(existedUser)

    if (existedUser) {
        throw new ApiError(409, "user with email or username already exists")
    }

    const avatarlocalPath = req.files?.avatar[0]?.path;
    const coverImageLocalPath = req.files?.coverImage[0]?.path;

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



    return res.status(201).json(
        new ApiResponse(200, createdUser, "user register successfully")
    )
});



export { registerUser };