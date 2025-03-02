// attachmentUtils.js - Utility for handling file attachments

export const handleFileChange = (event, setAttachments) => {
    const files = event.target.files;
    
    // Generate metadata for the selected files
    const fileMetadata = Array.from(files).map((file) => ({
        file_name: file.name,
        file_path: `https://your-storage-service.com/uploads/${file.name}`, // Dummy storage link in company's preffered storage service
        mime_type: file.type,
    }));
    
    setAttachments(fileMetadata);
};