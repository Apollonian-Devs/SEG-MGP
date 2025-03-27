import { toast } from "sonner";  

/**
 * API Error Handling Utilities - Functions for handling and formatting API errors.
 *
 * @function handleApiError
 * @description Logs the error and displays an error toast notification to the user.
 * @param {object} error - The error object received from an API request.
 * @param {string} [userMessage="Something went wrong. Please try again."] - A custom message displayed to the user.
 *
 * @function formatApiErrorMessage
 * @description Formats error messages for display, extracting details from the error response.
 * @param {object} error - The error object received from an API request.
 * @param {string} [fallback="An unknown error occurred"] - A fallback message if no error details are available.
 * @param {object} [opts={ includePrefix: true }] - Options for formatting the message.
 * @param {boolean} [opts.includePrefix=true] - Whether to include a prefix (e.g., "❌") in the message.
 * @returns {string} - A formatted error message suitable for display.
 */


const handleApiError = (error, userMessage = "Something went wrong. Please try again.") => {
    console.error(error);
    if (error && error.response) {
        console.error(error.response.data);
    }
    console.error(error?.message);
    toast.error(`❌ ${userMessage}`);
};



export const formatApiErrorMessage = (
    error,
    fallback = "An unknown error occurred",
    opts = { includePrefix: true }
  ) => {
    console.error(error);
    const detailedMessage = error?.response?.data || error?.message || fallback;
    return opts.includePrefix ? `❌ ${detailedMessage}` : detailedMessage;
  };
  

  
  
  
export default handleApiError;




