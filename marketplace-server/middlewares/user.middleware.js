const loggedIn = async (req, res, next) => {
  try {
    next();
  } catch (error) {
    res.status(401).send(error);
  }
}