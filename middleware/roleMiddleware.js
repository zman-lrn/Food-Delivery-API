module.exports = (requiredRoles) => {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });

    const rolesArray = Array.isArray(requiredRoles)
      ? requiredRoles
      : [requiredRoles];

    if (!rolesArray.includes(req.user.role)) {
      return res
        .status(403)
        .json({ error: "Only admin can update order status" });
    }

    next();
  };
};
