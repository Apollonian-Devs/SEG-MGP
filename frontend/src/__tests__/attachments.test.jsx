import { describe, it, vi, expect } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useFileInput } from "../utils/attachmentUtils";

describe('useFileInput', () => {
  it('should call handleFileChange and setAttachments with file metadata', () => {
    const mockSetAttachments = vi.fn();

    const { result } = renderHook(() => useFileInput(mockSetAttachments));

    const fakeFile = new File(['dummy content'], 'example.txt', {
      type: 'text/plain',
    });

    const fakeEvent = {
      target: {
        files: [fakeFile],
      },
    };

    result.current.handleChange(fakeEvent);

    expect(mockSetAttachments).toHaveBeenCalledWith([
      {
        file_name: 'example.txt',
        file_path: 'https://your-storage-service.com/uploads/example.txt',
        mime_type: 'text/plain',
      },
    ]);
  });

  it('should reset file input value when resetFileInput is called', () => {
    const mockSetAttachments = vi.fn();

    const { result } = renderHook(() => useFileInput(mockSetAttachments));

    result.current.fileInputRef.current = { value: 'someValue' };

    result.current.resetFileInput();

    expect(result.current.fileInputRef.current.value).toBe('');
  });
});
