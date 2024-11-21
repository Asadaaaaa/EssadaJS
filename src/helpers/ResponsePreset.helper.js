class ResponsePreset {
  
  /**
   * Generates a successful response object.
   *
   * @param {string} message - The success message.
   * @param {Object|null} data - The data to include in the response.
   * @returns {Object} The response object with status 200, message, and optional data.
   */
  resOK(message, data) {
      return {
        status: 200,
        message,
        ...(data === null ? {} : {data})
      }
  }
  
  /**
   * Generates an error response object.
   *
   * @param {number} status - The HTTP status code.
   * @param {string} message - The error message.
   * @param {string} type - The type of error.
   * @param {Object|null} data - The data to include in the error response.
   * @returns {Object} The response object with status, message, error type, and optional data.
   */
  resErr(status, message, type, data) {
      return {
        status,
        message,
        err: {
          type,
          ...(data === null ? {} : {data})
        }
      }
  }
}

export default ResponsePreset;