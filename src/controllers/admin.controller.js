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

    return res.status(200).json({
      status: 200,
      message: "Login successful",
    });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: error.message,
    });
  }
};
