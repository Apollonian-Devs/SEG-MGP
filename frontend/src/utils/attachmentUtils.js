import { useRef } from 'react';

/**
 * @function
 * handleFileChange - A utility function to process and store file attachments' metadata.
 * 
 * @param {Object} event - The file input change event.
 * @param {Function} setAttachments - A state setter function to store the file metadata.
 *
 * @returns {void}
 */

export const handleFileChange = (event, setAttachments) => {
    const files = event.target.files;
    
    const fileMetadata = Array.from(files).map((file) => ({
        file_name: file.name,
        file_path: `https://your-storage-service.com/uploads/${file.name}`,
        mime_type: file.type,
    }));
    
    setAttachments(fileMetadata);
};

/**
 * @function
 * useFileInput - A custom React hook providing functionalities for handling file attachments in forms.
 * 
 * @param {Function} setAttachments - A state setter function to store the file metadata.
 *
 * @returns {Object} - Contains:
 *   - fileInputRef (React.RefObject<HTMLInputElement>): A ref to the file input element.
 *   - handleChange (Function): Processes the file input change event.
 *   - resetFileInput (Function): Resets the file input element.
 */

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
