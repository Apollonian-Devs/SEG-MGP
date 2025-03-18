import { toast } from "sonner";  


const handleApiError = (error, userMessage = "Something went wrong. Please try again.") => {
    console.error(error);
    console.error(error.response?.data);
    console.error(error.message);

    toast.error(`❌ ${userMessage}`);
};

export default handleApiError;



