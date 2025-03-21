import { toast } from "sonner";  


const handleApiError = (error, userMessage = "Something went wrong. Please try again.") => {
    console.error(error);
    if (error && error.response) {
        console.error(error.response.data);
    }
    console.error(error?.message);
    toast.error(`❌ ${userMessage}`);
};

export const formatApiErrorMessage = (error, fallback = "An unknown error occurred") => {
    console.error(error);
    return `❌ ${error?.message || fallback}`;
  };
  
export default handleApiError;




