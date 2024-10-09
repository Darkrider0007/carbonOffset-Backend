import jwt from "jsonwebtoken";

export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (
      email !== process.env.ADMIN_EMAIL1 ||
      email !== process.env.ADMIN_EMAIL2 ||
      email !== process.env.ADMIN_EMAIL3
    ) {
      return res.status(401).json({
        status: 401,
        message: "Invalid email",
      });
    }

    if (password !== process.env.ADMIN_PASSWORD) {
      return res.status(401).json({
        status: 401,
        message: "Invalid password",
      });
    }

    const token = jwt.sign(
      {
        email,
      },
      process.env.ADMIN_JWT_SECRET,
      {
        expiresIn: process.env.ADMIN_JWT_EXPIREY,
      }
    );

    return res.status(200).json({
      status: 200,
      message: "Login successful",
      token: token,
    });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: error.message,
    });
  }
};

export const verifyAdmin = async () => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, process.env.ADMIN_JWT_SECRET);

    if (
      decoded.email !== process.env.ADMIN_EMAIL1 &&
      decoded.email !== process.env.ADMIN_EMAIL2 &&
      decoded.email !== process.env.ADMIN_EMAIL3
    ) {
      return res.status(401).json({
        status: 401,
        message: "Unauthorized",
      });
    }

    return res.status(200).json({
      status: 200,
      message: "Authorized",
      decoded: decoded,
    });
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: error.message,
    });
  }
};
