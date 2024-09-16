import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

const verifyJWT = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader) {
      const token = authHeader.split(" ")[1];
      const userData = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

      const user = await User.findById(userData._id).select(
        "-password -refreshToken"
      );
      req.user = user;
      next();
    } else {
      return res.status(401).json("you're not authenticated");
    }
  } catch (error) {
    return res.status(500).send({
      status: 500,
      message: "An internal server error occurred",
      error: error.message,
    });
  }
};
export { verifyJWT };
