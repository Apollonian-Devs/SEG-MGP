import {GenericInput} from '../../../components';
import { render, screen } from "@testing-library/react";
import userEvent from '@testing-library/user-event';

describe("GenericInput Component", () => {
    it("Generic input should be correctly rendered with the correct given label", () => {
        render(<GenericInput label="test"/>);
        expect(screen.getByText(/test/i)).toBeInTheDocument();
    });

    it ("Generic input should be correctly rendered with the given type", () => {
        render(<GenericInput type="text" />);
        expect(screen.getByRole("textbox")).toBeInTheDocument();

    });

    it("Generic input should allow the user to type into a textbox and show the value", async () => {
        render(<GenericInput type="text"/>)

        const textbox = screen.getByRole("textbox");
        expect(textbox).toBeInTheDocument();

        await userEvent.type(textbox, "test input");

        expect(textbox).toHaveValue("test input");
    });

    it("Generic input should call the onChange function when the user checks a checkbox", async () => {
        const mockOnChange = vi.fn();

        render(<GenericInput type="checkbox" onChange={ mockOnChange }/>);

        const checkbox = screen.getByRole("checkbox");
        expect(checkbox).toBeInTheDocument()

        await userEvent.click(checkbox);

        expect(checkbox).toBeChecked();
        expect(mockOnChange).toHaveBeenCalledTimes(1);
    });

    it("Generic input should call the onChange function when the user uploads a file to the file input", async () => {
        render(<GenericInput type="file" placeholder="File input"/>);
    
        
        const fileInput = screen.getByPlaceholderText(/file input/i);
        expect(fileInput).toBeInTheDocument();

        const file = new File(["test"], "test_file.png");

        await userEvent.upload(fileInput, file);

        expect(fileInput.files[0]).toBe(file);
    });

});