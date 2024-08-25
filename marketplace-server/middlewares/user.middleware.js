import AuthController from "../controllers/auth.controller";

const isAuthenticated = async (req, res, next) => {
  const idToken = req.headers.authorization?.split("Bearer ")[1];

  if (!idToken) {
    return res.status(403).json({ error: "No token provided" });
  }

  try {
    const decodedToken = await AuthController.verifyIdToken(idToken);
    req.user = decodedToken;

    next();
  } catch (error) {
    return res.status(403).json({ error: "Invalid token" });
  }
};

export default isAuthenticated;
