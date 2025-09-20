const NodeCache = require("node-cache");
const cache = new NodeCache({ stdTTL: 60 });

module.exports = (req, res, next) => {
  const key = req.originalUrl;
  const cachedData = cache.get(key);
  if (cachedData) {
    console.log("Serving from cache:", key);
    return res.json(cachedData);
  }

  res.sendResponse = res.json;
  res.json = (body) => {
    const data =
      body && typeof body.toJSON === "function" ? body.toJSON() : body;
    cache.set(key, data);
    res.sendResponse(data);
  };

  next();
};
