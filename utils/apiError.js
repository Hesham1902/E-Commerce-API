class apiError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith(4) ? "fail" : "error";
    this.Operational = true;
  }
  
  getStatus() {
    console.log(this.statusCode);
  }
}

module.exports = apiError;
