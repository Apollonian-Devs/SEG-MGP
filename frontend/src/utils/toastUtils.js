
import { toast } from 'sonner';
import { formatApiErrorMessage } from './errorHandler';

/**
 * handleToastPromise - A utility function for handling API promises with toast notifications.
 *
 * @function
 *
 * @param {Promise} promise - The promise to be handled.
 * @param {object} options - Configuration for the toast notifications.
 * @param {string} [options.loading="Loading..."] - The message displayed while the promise is pending.
 * @param {string} [options.successMessage="Operation successful"] - The message displayed when the promise resolves successfully.
 * @param {function} [options.successCallback] - An optional callback executed after a successful promise resolution.
 * @param {string} [options.errorMessage] - A custom error message displayed when the promise rejects.
 * @param {function} [options.errorCallback] - An optional callback executed when an error occurs.
 *
 * @returns {Promise} - A promise wrapped with toast notifications for loading, success, and error states.
 */

export const handleToastPromise = (promise, {
  loading = 'Loading...',
  successMessage = 'Operation successful',
  successCallback, 
  errorMessage, 
  errorCallback, 
} = {}) => {
  return toast.promise(promise, {
    loading,
    success: async () => {
      if (successCallback) {
        await successCallback();
      }
      return successMessage;
    },
    error: (error) =>
      errorCallback
        ? errorCallback(error)
        : errorMessage || formatApiErrorMessage(error, 'An error occurred', { includePrefix: false }),
  });
};
