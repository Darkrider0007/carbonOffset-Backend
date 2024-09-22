import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

const verifyAdmin = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader) {
      const token = authHeader.split(" ")[1];
      const adminData = jwt.verify(token, process.env.ADMIN_JWT_SECRET);

      if (
        adminData.email !== process.env.ADMIN_EMAIL1 &&
        adminData.email !== process.env.ADMIN_EMAIL2 &&
        adminData.email !== process.env.ADMIN_EMAIL3
      ) {
        return res.status(401).json("you're not authenticated");
      }
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
export { verifyAdmin };
