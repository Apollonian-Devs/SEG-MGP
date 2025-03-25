import { render, screen, fireEvent } from '@testing-library/react';
import Popup from '../../components/Popup';
import userEvent from '@testing-library/user-event';

describe('Popup', () => {
    it ('should render children', () => {
        render(<Popup isOpen={true} onClose={() => {}}><div>Test</div></Popup>);
        expect(screen.getByText('Test')).toBeInTheDocument();
    });


    it ('should not render children', () => {
        render(<Popup isOpen={false} onClose={() => {}}><div>Test</div></Popup>);
        expect(screen.queryByText('Test')).not.toBeInTheDocument();
    });


    it("should call onClose when close button is clicked", async () => {
        const onClose = vi.fn();
        render(
            <Popup isOpen={true} onClose={onClose}>
            <div>Test</div>
            </Popup>
        );

        const closeButton = screen.getByRole("button");
        await userEvent.click(closeButton);
        expect(onClose).toHaveBeenCalled();
    });

    it ('should call onClose when close button clicked is indeed the x', async () => {
        const onClose = vi.fn();
        render(
            <Popup isOpen={true} onClose={onClose}>
            <div>Test</div>
            </Popup>
        );

        const closeButton2 = screen.getByText("✕");   
        await(userEvent.click(closeButton2));
        expect(onClose).toHaveBeenCalled();
    });


    it("should not call onClose when clicking inside the popup", async () => {
        const onClose = vi.fn();
        render(<Popup isOpen={true} onClose={onClose}><div>Test</div></Popup>);
    
        const popupContainer = screen.getByText("Test").parentElement; 
        await userEvent.click(popupContainer); 
    
        expect(onClose).not.toHaveBeenCalled(); 
    });

    
    it("should call onClose when clicking outside the popup", async () => {
        const onClose = vi.fn();
        render(<Popup isOpen={true} onClose={onClose}><div>Test</div></Popup>);
    
        const overlay = screen.getByTestId("popup-overlay"); 
        await userEvent.click(overlay);
    
        expect(onClose).toHaveBeenCalled(); 
    });
    
    

    it ('should not propogate parent click event', async () => {
        const onClose = vi.fn();
        render(
            <Popup isOpen={true} onClose={onClose}>
            <div>Test</div>
            </Popup>
        );

        const child = screen.getByText('Test');
        await userEvent.click(child);
        expect(onClose).not.toHaveBeenCalled();
    });

    it("width and height should be default", () => {
        render(<Popup isOpen={true} onClose={() => {}}><div>Test</div></Popup>);
        const popupContainer = screen.getByText('Test').parentElement.parentElement;
        expect(popupContainer.className).toEqual(expect.stringContaining("500px"));
        expect(popupContainer.className).toEqual(expect.stringContaining("300px"));
    });
    
    it("width and height should be custom", () => {    
        render(<Popup isOpen={true} onClose={() => {}} width="400px" height="200px"><div>Test</div></Popup>);
        const popupContainer = screen.getByText('Test').parentElement.parentElement;
        expect(popupContainer.className).toEqual(expect.stringContaining("400px"));
        expect(popupContainer.className).toEqual(expect.stringContaining("200px"));
    });
    
    

});

