const crypto = require("crypto");

const hash = (resetCode) =>
  crypto.createHash("sha256").update(resetCode).digest("hex");

module.exports = hash;
