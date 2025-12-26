import jwt from "jsonwebtoken";

const userAuth = async (req, res, next) => {
  try {
    const { token } = req.cookies;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Not Authorized, Login Again",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded?.id) {
      return res.status(401).json({
        success: false,
        message: "Not Authorized, Login Again",
      });
    }

    // attach user info to request
    req.user = { userId: decoded.id };

    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};

export default userAuth;
