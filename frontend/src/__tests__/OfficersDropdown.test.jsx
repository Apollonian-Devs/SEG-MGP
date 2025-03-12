import { render, screen, fireEvent } from '@testing-library/react';
import OfficersDropdown from '../components/OfficersDropdown';
import api from '../api'; 


describe('OfficersDropdown Component', () => {
    it('renders with correct default text', () => {
        render(<OfficersDropdown officers={[]} setSelectedOfficer={() => {}} />);
        expect(screen.getByText('Select an officer')).toBeInTheDocument();
    });

    it('renders children when dropdown is open', () => {
        render(
            <OfficersDropdown 
                officers={[
                    { user: { id: 1, username: 'user1' } },
                    { user: { id: 2, username: 'user2' } },
                ]}
                setSelectedOfficer={() => {}}
            />
        );

        fireEvent.click(screen.getByText('Select an officer'));

        expect(screen.getByText('user1')).toBeInTheDocument();
        expect(screen.getByText('user2')).toBeInTheDocument();
    });

    it('renders correct text when officer is selected', () => {

        const mockSetSelectedOfficer = vi.fn();

        
        render(
            <OfficersDropdown 
                officers={[
                    { user: { id: 1, username: 'user1' } },
                    { user: { id: 2, username: 'user2' } },
                ]}
                setSelectedOfficer={mockSetSelectedOfficer}
            />
        );

        fireEvent.click(screen.getByText('Select an officer'));
        fireEvent.click(screen.getByText('user1'));

        expect(mockSetSelectedOfficer).toHaveBeenCalledTimes(1);
        expect(screen.queryByText('Select an officer')).not.toBeInTheDocument();


    });

    it('renders children with admin when dropdown is open', () => {

        const adminUser = { id: 3, username: '@admin1', is_superuser: true };

        render(
            <OfficersDropdown 
                officers={[
                    { user: { id: 1, username: 'user1' } },
                    { user: { id: 2, username: 'user2' } },
                ]}
                admin={adminUser}
                setSelectedOfficer={() => {}}
            />
        );

        fireEvent.click(screen.getByText('Select an officer'));

        expect(screen.getByText('user1')).toBeInTheDocument();
        expect(screen.getByText('user2')).toBeInTheDocument();
        expect(screen.getByText('Admin: @admin1')).toBeInTheDocument();
    });

    it('renders correct text when admin is selected', () => {

        const mockSetSelectedOfficer = vi.fn();


        const adminUser = { id: 3, username: '@admin1', is_superuser: true };
        render(
            <OfficersDropdown 
                officers={[
                    { user: { id: 1, username: 'user1' } },
                    { user: { id: 2, username: 'user2' } },
                ]}
                admin= {adminUser}
                setSelectedOfficer={mockSetSelectedOfficer}
            />
        );

        fireEvent.click(screen.getByText('Select an officer'));
        fireEvent.click(screen.getByText('Admin: @admin1'));

        expect(mockSetSelectedOfficer).toHaveBeenCalledTimes(1);
        expect(screen.queryByText('Select an officer')).not.toBeInTheDocument();


    });
   
});
