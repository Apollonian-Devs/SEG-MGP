import { render, screen, fireEvent, act } from '@testing-library/react';
import React from 'react';
import GenericDropdown from '../components/GenericDropdown';
import { describe, it, expect } from 'vitest';
import '@testing-library/jest-dom/vitest';

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

  
    it('sets menuPositionAbove and menuPositionRight when space is limited', async () => {
      Object.defineProperty(HTMLElement.prototype, 'getBoundingClientRect', {
        configurable: true,
        value: function () {
          if (this.tagName === 'DIV') {
            return {
              width: 450,
              height: 250,
              top: 300,
              bottom: 600,
              right: 600,
              left: 200,
            };
          }
          return { width: 0, height: 0, top: 0, bottom: 0, right: 0, left: 0 };
        },
      });
    
      render(
        <GenericDropdown buttonName="Test Button" maxHeight='none'>
          <div>Option 1</div>
          <div>Option 2</div>
        </GenericDropdown>
      );
    
      fireEvent.click(screen.getByText('Test Button'));
    
      const dropdownMenu = screen.getByRole('menu');
      expect(dropdownMenu).toBeInTheDocument();
    
      expect(dropdownMenu.getAttribute('data-position-above')).toBe('true');
      expect(dropdownMenu.getAttribute('data-position-right')).toBe('true');
    });
});