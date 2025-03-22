
import { toast } from 'sonner';
import { formatApiErrorMessage } from './errorHandler';

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
