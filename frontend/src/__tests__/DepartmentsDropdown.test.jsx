import { describe, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import DepartmentsDropdown from '../components/DepartmentsDropdown';
import api from '../api';
import { ACCESS_TOKEN } from '../constants';
import { toast } from 'sonner';


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

  vi.mock('sonner', () => ({
          toast: {
              error: vi.fn(),
              success: vi.fn()
          },
      }));

  it('shows loading state initially', () => {
    api.get.mockImplementation(() => new Promise(() => {})); 
    
    render(<DepartmentsDropdown setSelectedDepartments={mockSetSelectedDepartment} />);
    expect(screen.getByText('Loading departments...')).toBeInTheDocument();
  });


  it('displays departments after successful fetch', async () => {
    api.get.mockResolvedValue({ data: mockDepartments });
    
    render(<DepartmentsDropdown setSelectedDepartments={mockSetSelectedDepartment} />);
    
    await waitFor(() => {
      expect(screen.queryByText('Loading departments...')).not.toBeInTheDocument();
    });
    
    fireEvent.click(screen.getByText('Select a department'));
    
    mockDepartments.forEach(dept => {
      expect(screen.getByText(dept.name)).toBeInTheDocument();
    });
  });



  it('does not close the dropdown when a department is selected', async () => {
    api.get.mockResolvedValue({ data: mockDepartments });

    render(<DepartmentsDropdown setSelectedDepartments={() => {}} />);

    await waitFor(() => {
      expect(screen.queryByText('Loading departments...')).not.toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Select a department'));

    mockDepartments.forEach(dept => {
      expect(screen.getByText(dept.name)).toBeInTheDocument();
    });

    const menuItem = screen.getByRole('button', { name: 'IT' });
    fireEvent.click(menuItem);

    const departmentInOptions = screen.getAllByText('IT');
    expect(departmentInOptions).toHaveLength(2); 
  });


  it('shows "Select a department" when no department is selected', async () => {
    render(<DepartmentsDropdown setSelectedDepartments={mockSetSelectedDepartment} />);

    await waitFor(() => {
      expect(screen.queryByText('Loading departments...')).not.toBeInTheDocument();
    });

    expect(screen.getByText('Select a department')).toBeInTheDocument();
  });


  it('handles API error', async () => {
    api.get.mockRejectedValue({ response: { data: 'Error' }, message: 'API Error' });
    
    render(<DepartmentsDropdown setSelectedDepartments={mockSetSelectedDepartment} />);
    
    await waitFor(() => {
      expect(screen.queryByText('Loading departments...')).not.toBeInTheDocument();
    });

    expect(toast.error).toHaveBeenCalledWith("❌ Error fetching departments")
  });


  it('does not display any departments or loading message when the list is empty', async () => {
    api.get.mockResolvedValue({ data: [] });
  
    render(<DepartmentsDropdown setSelectedDepartments={mockSetSelectedDepartment} />);
  
    await waitFor(() => {
      expect(screen.queryByText('Loading departments...')).not.toBeInTheDocument();
    });
  
    fireEvent.click(screen.getByText('Select a department'))
    
    mockDepartments.forEach(dept => {
      expect(screen.queryByText(dept.name)).not.toBeInTheDocument();
    });
  
    expect(screen.getByText('Select a department')).toBeInTheDocument();
  });


  it('selects department and updates state', async () => {
    api.get.mockResolvedValue({ data: mockDepartments });
    
    render(<DepartmentsDropdown setSelectedDepartments={mockSetSelectedDepartment} />);
    
    await waitFor(() => {
      expect(screen.queryByText('Loading departments...')).not.toBeInTheDocument();
    });
  
    
    fireEvent.click(screen.getByText('Select a department'));
    
    
    const menuItem = screen.getByRole('button', { name: 'IT' });
    fireEvent.click(menuItem);
    
    const displayedText = screen.getByText('IT', { selector: 'h5' });
    expect(displayedText).toBeInTheDocument();
  });


  it('uses correct API headers', async () => {
    api.get.mockResolvedValue({ data: mockDepartments });
    
    render(<DepartmentsDropdown setSelectedDepartments={mockSetSelectedDepartment} />);
    
    await waitFor(() => {
      expect(api.get).toHaveBeenCalledWith('/api/departments/', {
        headers: { Authorization: 'Bearer mock-access-token' }
      });
    });
  });


  it('displays the university icon next to each department name', async () => {
    api.get.mockResolvedValue({ data: mockDepartments });
  
    render(<DepartmentsDropdown setSelectedDepartments={mockSetSelectedDepartment} />);
    
    await waitFor(() => {
      expect(screen.queryByText('Loading departments...')).not.toBeInTheDocument();
    });
  
    fireEvent.click(screen.getByText('Select a department'));

    mockDepartments.forEach((dept) => {

      const departmentItem = screen.getByText(dept.name);
      const button = departmentItem.closest('button');
      const icon = button.querySelector('svg');
      expect(icon).toBeInTheDocument(); 
      expect(icon).toHaveClass('lucide-university'); 
    });
  });

  it('handles missing access token', async () => {
    localStorage.getItem.mockImplementation(() => null);
    api.get.mockResolvedValue({ data: mockDepartments });
    
    render(<DepartmentsDropdown setSelectedDepartments={mockSetSelectedDepartment} />);
    
    await waitFor(() => {
      expect(api.get).toHaveBeenCalledWith('/api/departments/', {
        headers: { Authorization: 'Bearer null' }
      });
    });
  });
});