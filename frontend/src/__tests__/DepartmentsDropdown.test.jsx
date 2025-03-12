import { describe, test, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import DepartmentsDropdown from '../components/DepartmentsDropdown';
import api from '../api';
import { ACCESS_TOKEN } from '../constants';


vi.mock('../api');


const mockLocalStorage = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
global.localStorage = mockLocalStorage;

describe('DepartmentsDropdown', () => {
  const mockDepartments = [
    { id: 1, name: 'IT' },
    { id: 2, name: 'HR' },
    { id: 3, name: 'Finance' },
  ];
  const mockSetSelectedDepartment = vi.fn();

  beforeEach(() => {
    localStorage.getItem.mockImplementation(() => 'mock-access-token');
    api.get.mockReset();
    mockSetSelectedDepartment.mockClear();
    vi.clearAllMocks();
  });

  test('shows loading state initially', () => {
    api.get.mockImplementation(() => new Promise(() => {})); 
    
    render(<DepartmentsDropdown setSelectedDepartment={mockSetSelectedDepartment} />);
    expect(screen.getByText('Loading departments...')).toBeInTheDocument();
  });

  test('displays departments after successful fetch', async () => {
    api.get.mockResolvedValue({ data: mockDepartments });
    
    render(<DepartmentsDropdown setSelectedDepartment={mockSetSelectedDepartment} />);
    
    await waitFor(() => {
      expect(screen.queryByText('Loading departments...')).not.toBeInTheDocument();
    });
    
    fireEvent.click(screen.getByText('Select a department'));
    
    mockDepartments.forEach(dept => {
      expect(screen.getByText(dept.name)).toBeInTheDocument();
    });
  });

  test('handles API error', async () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    api.get.mockRejectedValue({ response: { data: 'Error' }, message: 'API Error' });
    
    render(<DepartmentsDropdown setSelectedDepartment={mockSetSelectedDepartment} />);
    
    await waitFor(() => {
      expect(screen.queryByText('Loading departments...')).not.toBeInTheDocument();
    });
    
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      'Error fetching departments:',
      'Error'
    );
    consoleErrorSpy.mockRestore();
  });

  test('selects department and updates state', async () => {
    api.get.mockResolvedValue({ data: mockDepartments });
    
    render(<DepartmentsDropdown setSelectedDepartment={mockSetSelectedDepartment} />);
    
    await waitFor(() => {
      expect(screen.queryByText('Loading departments...')).not.toBeInTheDocument();
    });
  
    
    fireEvent.click(screen.getByText('Select a department'));
    
    
    const menuItem = screen.getByRole('button', { name: 'IT' });
    fireEvent.click(menuItem);
    
    
    await waitFor(() => {
      expect(mockSetSelectedDepartment).toHaveBeenCalledWith(mockDepartments[0]);
    });
  
    
    const displayedText = screen.getByText('IT', { selector: 'h5' });
    expect(displayedText).toBeInTheDocument();
  });

  test('uses correct API headers', async () => {
    api.get.mockResolvedValue({ data: mockDepartments });
    
    render(<DepartmentsDropdown setSelectedDepartment={mockSetSelectedDepartment} />);
    
    await waitFor(() => {
      expect(api.get).toHaveBeenCalledWith('/api/departments/', {
        headers: { Authorization: 'Bearer mock-access-token' }
      });
    });
  });

  test('handles missing access token', async () => {
    localStorage.getItem.mockImplementation(() => null);
    api.get.mockResolvedValue({ data: mockDepartments });
    
    render(<DepartmentsDropdown setSelectedDepartment={mockSetSelectedDepartment} />);
    
    await waitFor(() => {
      expect(api.get).toHaveBeenCalledWith('/api/departments/', {
        headers: { Authorization: 'Bearer null' }
      });
    });
  });
});