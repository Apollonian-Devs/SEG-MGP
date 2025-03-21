import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import GenericDropdown from '../components/GenericDropdown';
import { describe, it, expect } from 'vitest';
import '@testing-library/jest-dom/vitest';

/*
import React, { useState } from "react";
import GenericDropdown from "./GenericDropdown";
import GenericButton from "./GenericButton";

const OfficersDropdown = ({ officers, setSelectedOfficer }) => {
  console.log("Officers in Dropdown", officers)
  const [selectedOfficer, setSelectedOfficerState] = useState(null);

  const handleSelect = (officer) => {
    setSelectedOfficer(officer);
    setSelectedOfficerState(officer);
  };

  return (
    <div className="flex items-center gap-2">
      <GenericDropdown
        buttonName={
          <h5 className="text-sm">{selectedOfficer ? selectedOfficer.user.username : "Select an officer"}</h5>
        }
        className="flex justify-center items-center gap-x-1.5 rounded-md bg-white px-2 py-1 text-sm font-semibold text-gray-900 ring-1 shadow-xs ring-gray-300 ring-inset hover:bg-gray-50"
      >
        <div className="py-1">
          {officers.map((officer) => (
            <GenericButton
              key={officer.user.id}
              onClick={(e) => { 
                e.stopPropagation();
                handleSelect(officer);
              }}
              className="block w-full text-left px-3 py-1 text-sm text-gray-700 hover:bg-gray-100"
            >
              {officer.user.username}
            </GenericButton>
          ))}
        </div>
      </GenericDropdown>
    </div>
  );
};

export default OfficersDropdown;
*/

describe('GenericDropdown Component', () => {
    it('renders with correct button name', () => {
        render(<GenericDropdown buttonName="Click Me" />);
        expect(screen.getByText('Click Me')).toBeInTheDocument();
    });


    it('applies the provided className', () => {
      render(
        <GenericDropdown buttonName="Select TestButton" className="custom-class">
          <div>Option 1</div>
        </GenericDropdown>
      );
  
      // Ensure the custom class is applied to the dropdown button
      const button = screen.getByText('Select TestButton');
      expect(button).toHaveClass('custom-class');
    });

  
    it('toggles dropdown closed when clicked on while open', () => {
      render(
        <GenericDropdown buttonName="Select TestButton">
          <div>Option 1</div>
        </GenericDropdown>
      );
  
      fireEvent.click(screen.getByText('Select TestButton'));
      expect(screen.getByText('Option 1')).toBeInTheDocument();

      fireEvent.click(screen.getByText('Select TestButton'));
      expect(screen.queryByText('Option 1')).not.toBeInTheDocument();

    });


    it('shows correct children when toggled', () => {
      render(
        <GenericDropdown buttonName="Select TestButton">
          <div>Option 1</div>
          <div>Option 2</div>
        </GenericDropdown>
      );
  
      fireEvent.click(screen.getByText('Select TestButton'));
      expect(screen.getByText('Option 1')).toBeInTheDocument();
      expect(screen.getByText('Option 2')).toBeInTheDocument();
    });


    it('allows options to be clicked on', () => {
      render(
        <GenericDropdown buttonName="Select TestButton">
          <div>Option 1</div>
          <div>Option 2</div>
          <div>Option 3</div>
          <div>Option 4</div>
        </GenericDropdown>
      );
  
      fireEvent.click(screen.getByText('Select TestButton'));

      fireEvent.click(screen.getByText('Option 1'));
      fireEvent.click(screen.getByText('Option 2'));
      fireEvent.click(screen.getByText('Option 3'));
      fireEvent.click(screen.getByText('Option 4'));
    });


    it('has correct max height', () => {
      render(
        <GenericDropdown buttonName="Select TestButton" maxHeight="100">
          <div>Option 1</div>
          <div>Option 2</div>
          <div>Option 3</div>
          <div>Option 4</div>
          <div>Option 5</div>
          <div>Option 6</div>
        </GenericDropdown>
      );
  
      fireEvent.click(screen.getByText('Select TestButton'));
  
      const dropdown = screen.getByRole('menu');
      expect(dropdown).toHaveStyle('max-height: 100px');
    });


    it('does not close dropdown automatically when option is selected', () => {
      render(
        <GenericDropdown buttonName="Select option">
          <div>Option 1</div>
          <div>Option 2</div>
        </GenericDropdown>
      );

      fireEvent.click(screen.getByText('Select option'));
      expect(screen.getByText('Option 1')).toBeInTheDocument();
  
      fireEvent.click(screen.getByText('Option 1'));
      
      expect(screen.queryByText('Option 2')).toBeInTheDocument();
    });


    it('closes the dropdown when clicking outside', () => {
      
      render(
        <GenericDropdown buttonName="Select TestButton">
          <button>Option 1</button>
          <button>Option 2</button>
        </GenericDropdown>
      );
  
      fireEvent.click(screen.getByText('Select TestButton'));
  
      expect(screen.getByText('Option 1')).toBeInTheDocument();
      expect(screen.getByText('Option 2')).toBeInTheDocument();
  
      fireEvent.mouseDown(document.body);
  
      expect(screen.queryByText('Option 1')).not.toBeInTheDocument();
      expect(screen.queryByText('Option 2')).not.toBeInTheDocument();
    });

  
    it('sets minWidth to auto when dropdownWidth is 0', () => {
      // Mock the dropdownWidth to be 0
      render(
        <GenericDropdown buttonName="Select TestButton">
          <div>Option 1</div>
          <div>Option 2</div>
        </GenericDropdown>
      );
  
      // Simulate opening the dropdown
      fireEvent.click(screen.getByText('Select TestButton'));
  
      const dropdownMenu = screen.getByRole('menu');
  
      // Check that minWidth is set to 'auto'
      expect(dropdownMenu).toHaveStyle('min-width: auto');
    });

    it('calculates dropdown position correctly and sets menuPositionAbove and menuPositionRight', () => {
       
      const buttonGetBoundingClientRect = vi.spyOn(HTMLDivElement.prototype, 'getBoundingClientRect')
        .mockImplementationOnce(() => ({
          top: 100,
          right: 200,
          bottom: 200, // Button's bottom position (button is positioned near the top)
          left: 100,
          width: 150,
          height: 40,
        }));
      
      // Create a spy for getBoundingClientRect for dropdown menu (the menu element)
      const menuGetBoundingClientRect = vi.spyOn(HTMLDivElement.prototype, 'getBoundingClientRect')
        .mockImplementationOnce(() => ({
          top: 300, 
          right: 150,
          bottom: 100, // Increase the height of the dropdown menu so that the space below the button is insufficient
          left: 100,
          width: 150,
          height: 200, // Height of the dropdown menu (menu is too tall to fit below)
        }));
  
      render(
        <GenericDropdown buttonName="Select TestButton" maxHeight="100">
          <div>Option 1</div>
          <div>Option 2</div>
          <div>Option 3</div>
        </GenericDropdown>
      );
  
      // Simulate opening the dropdown
      fireEvent.click(screen.getByText('Select TestButton'));
  
      // Assert that the dropdown menu is rendered
      expect(screen.getByText('Option 1')).toBeInTheDocument();
  
      // Check if the dropdown menu has a max-height of 100px (set in the test)
      const dropdownMenu = screen.getByRole('menu');
      expect(dropdownMenu).toHaveStyle('max-height: 100px');
  
      // Assert if the dropdown menu is positioned above (bottom-full class)
      expect(dropdownMenu).toHaveClass('bottom-full'); // The `bottom-full` class should be applied if there's limited space below
  
      // Clean up after the test
      buttonGetBoundingClientRect.mockRestore();
      menuGetBoundingClientRect.mockRestore();
    });
  

});