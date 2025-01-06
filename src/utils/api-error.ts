class ApiError extends Error {
  status: number;
  constructor(message: string, status: number = 400) {
    super(message);
    this.status = status;

    Object.setPrototypeOf(this, ApiError.prototype);
  }

  msg() {
    return this.message;
  }
  statusCode() {
    return this.status;
  }
}

export default ApiError;
