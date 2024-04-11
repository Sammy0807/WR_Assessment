// errorHandler.js
const errorHandler = (err, req, res, next) => {
    // Log the error, for example using Winston (production level logging would need more details)
    console.error(err.stack);
  
    const statusCode = err.statusCode || 500; // Defaults to 500 if the error status code is not specified
    const errorMessage = err.message || 'An unexpected error occurred';
  
    // Send JSON error response
    res.status(statusCode).json({
      success: false,
      error: errorMessage,
      // You may not want to send the stack trace in a production environment
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    });
  };
  
  module.exports = errorHandler;
  