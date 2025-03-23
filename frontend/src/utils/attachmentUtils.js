import { useRef } from 'react';


export const handleFileChange = (event, setAttachments) => {
    const files = event.target.files;
    
    const fileMetadata = Array.from(files).map((file) => ({
        file_name: file.name,
        file_path: `https://your-storage-service.com/uploads/${file.name}`,
        mime_type: file.type,
    }));
    
    setAttachments(fileMetadata);
};


export const useFileInput = (setAttachments) => {
    const fileInputRef = useRef(null);

    const handleChange = (event) => {
        handleFileChange(event, setAttachments);
    };

    const resetFileInput = () => {
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    return { fileInputRef, handleChange, resetFileInput };
};
