import bcrypt from "bcrypt";
import User from "../models/user.model.js";
import sendOtp from "../helpers/sendMail.js";

const generateAccessAndRefreshTokens = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    const saveData = await user.save({ validateBeforeSave: false });
    if (!saveData) {
      res.status(500).send({
        status: 500,
        message: "User could not be saved",
      });
    }
    return { accessToken, refreshToken };
  } catch (error) {
    console.log("error: ", error);
    throw new ApiError(
      500,
      "Something went wrong while generating refresh and access token"
    );
  }
};

export const createUser = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    // Create an array of fields to check
    const requiredFields = [
      { field: firstName, name: "First name" },
      { field: lastName, name: "Last name" },
      { field: email, name: "Email" },
      { field: password, name: "Password" },
    ];

    // Use the `some` method to find the first missing field
    const missingField = requiredFields.find(({ field }) => !field);

    if (missingField) {
      return res.status(400).send({
        status: 400,
        message: `${missingField.name} is required`,
      });
    }

    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).send({
        status: 400,
        message: "User already exists",
      });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the user
    const user = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword, // Store the hashed password
    });

    if (!user) {
      return res.status(500).send({
        status: 500,
        message: "User could not be created",
      });
    }

    // Generate 6 digit OTP and send email

    const otp = Math.floor(100000 + Math.random() * 900000);

    await sendOtp(email, otp);

    user.verificationCode = otp;

    user.markModified("verificationCode");

    await user.save();

    // Send the success response
    res.status(201).send({
      status: "success",
      data: user,
      message: "User created successfully",
    });
  } catch (err) {
    res.status(500).send({
      status: 500,
      message: err.message,
    });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).send({
        status: 400,
        message: "All fields are required",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).send({
        status: 404,
        message: "User not found",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).send({
        status: 400,
        message: "Invalid credentials",
      });
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
      user._id
    );

    if (!accessToken || !refreshToken) {
      return res.status(500).send({
        status: 500,
        message: "Could not generate tokens",
      });
    }

    // Set cookies before sending the response
    // res.cookie("accessToken", accessToken, {
    //   httpOnly: true,
    //   sameSite: "none",
    //   secure: true,
    // });

    // res.cookie("refreshToken", refreshToken, {
    //   httpOnly: true,
    //   sameSite: "none",
    //   secure: true,
    // });

    // Now send the response
    return res.status(201).send({
      status: 201,
      data: user,
      accessToken,
      refreshToken,
      message: "User logged in successfully",
    });
  } catch (error) {
    return res.status(500).send({
      status: 500,
      message: error.message,
    });
  }
};

export const refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.cookies;

    if (!refreshToken) {
      return res.status(400).send({
        status: 400,
        message: "No refresh token provided",
      });
    }

    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

    console.log("decoded: ", decoded);

    const user = await User.findById(decoded._id);

    if (!user) {
      return res.status(404).send({
        status: 404,
        message: "User not found",
      });
    }

    if (refreshToken !== user.refreshToken) {
      return res.status(400).send({
        status: 400,
        message: "Invalid refresh token",
      });
    }

    const { accessToken, newRefreshToken } =
      await generateAccessAndRefreshTokens(decoded._id);

    if (!accessToken || !newRefreshToken) {
      return res.status(500).send({
        status: 500,
        message: "Could not generate tokens",
      });
    }

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      sameSite: "none",
      secure: true,
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      sameSite: "none",
      secure: true,
    });

    return res.status(201).send({
      status: 201,
      data: user,
      message: "Token refreshed successfully",
    });
  } catch (error) {
    res.status(500).send({
      status: 500,
      message: error.message,
    });
  }
};

export const getUser = async (req, res) => {
  try {
    const user = req.user;

    return res.status(201).send({
      status: 201,
      data: user,
      message: "User retrieved successfully",
    });
  } catch (error) {
    return res.status(500).send({
      status: 500,
      message: error.message,
    });
  }
};

export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);

    if (!user) {
      return res.status(404).send({
        status: 404,
        message: "User not found",
      });
    }

    res.status(200).send({
      status: "success",
      data: user,
      message: "User retrieved successfully",
    });
  } catch (err) {
    res.status(500).send({
      status: 500,
      message: err.message,
    });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const allUsers = await User.find();

    if (!allUsers) {
      return res.status(404).send({
        status: 404,
        message: "No users found",
      });
    }

    res.status(200).send({
      status: "success",
      data: allUsers,
      message: "All users retrieved successfully  ",
    });
  } catch (error) {
    res.status(500).send({
      status: 500,
      message: error.message,
    });
  }
};

export const logOut = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);

    if (!user) {
      return res.status(404).send({
        status: 404,
        message: "User not found",
      });
    }

    user.refreshToken = "";
    await user.save({ validateBeforeSave: false });

    res
      .status(200)
      .send({
        status: "success",
        message: "User logged out successfully",
      })
      .clearCookie("accessToken")
      .clearCookie("refreshToken");
  } catch (error) {
    res.status(500).send({
      status: 500,
      message: error.message,
    });
  }
};

export const updateUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);

    if (!user) {
      return res.status(404).send({
        status: 404,
        message: "User not found",
      });
    }

    const [firstName, lastName, email, password] = req.body;

    if (firstName) {
      user.firstName = firstName;
    }

    if (lastName) {
      user.lastName = lastName;
    }

    if (email) {
      user.email = email;
    }

    await user.save();

    res.status(200).send({
      status: "success",
      data: user,
      message: "User updated successfully",
    });
  } catch (err) {
    res.status(500).send({
      status: 500,
      message: err.message,
    });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.userId);

    if (!user) {
      return res.status(404).send({
        status: 404,
        message: "User not found",
      });
    }

    res.status(200).send({
      status: "success",
      message: "User deleted successfully",
    });
  } catch (error) {
    res.status(500).send({
      status: 500,
      message: error.message,
    });
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const send = sendOtp();
    res.send(send);
  } catch (error) {}
};

export const verifyEmail = async (req, res) => {
  try {
    const { id, pin } = req.body;
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).send({
        status: 404,
        message: "User not found",
      });
    }

    if (user.verificationCode !== pin) {
      return res.status(400).send({
        status: 400,
        message: "Invalid OTP",
      });
    }

    user.isVerified = true;
    user.verificationCode = null;

    user.markModified("isVerified");

    await user.save();

    res.status(200).send({
      status: "success",
      message: "Email verified successfully",
    });
  } catch (error) {
    console.log(error);
  }
};
