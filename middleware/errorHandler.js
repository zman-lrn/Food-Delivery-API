function notFound(req, res, next) {
  res.status(404).json({ error: "404 - not found" });
}

function errorHandler(err, req, res, next) {
  if (err.name === "SequelizeValidationError") {
    return res.status(400).json({
      error: "validation error",
      details: err.errors.map((e) => e.message),
    });
  }

  if (err.name === "SequelizeUniqueConstraintError") {
    return res.status(400).json({
      error: "duplicate info",
      details: err.errors.map((e) => e.message),
    });
  }

  if (err.name === "JsonWebTokenError") {
    return res.status(401).json({ error: "invalid token" });
  }

  if (err.statusCode) {
    return res.status(err.statusCode).json({ error: err.message });
  }

  res.status(500).json({
    error: "internal Server Error",
    message: err.message,
  });
}

module.exports = { notFound, errorHandler };
