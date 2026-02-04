class ApiResponse {
  constructor(statusCode, data, message = "Success") {
    this.statusCode = statusCode;
    this.success = statusCode < 400;
    this.message = message;
    this.data = this.convertBigIntToString(data);
  }

  convertBigIntToString(obj) {
    return JSON.parse(
      JSON.stringify(obj, (_, value) =>
        typeof value === "bigint" ? value.toString() : value,
      ),
    );
  }
}

export default ApiResponse;
