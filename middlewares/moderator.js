const moderator = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      message: "Utilisateur non authentifié",
    });
  }

  if (!["moderateur", "admin"].includes(req.user.role)) {
    return res.status(403).json({
      message: "Accès réservé aux modérateurs",
    });
  }

  next();
};

export default moderator;