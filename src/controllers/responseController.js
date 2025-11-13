module.exports = {
  success: (message = "Success", data = null) => ({
    success: true,
    message,
    data,
  }),

  failed: (message = "Something went wrong", code = 500) => ({
    success: false,
    message,
    code,
  }),
};
