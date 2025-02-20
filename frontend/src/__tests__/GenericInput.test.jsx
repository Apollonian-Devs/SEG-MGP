import { Italic } from "lucide-react";
import GenericInput from "../components/GenericInput";
import { render, screen } from "@testing-library/react";

describe(GenericInput, () => {

    it ("Generic input should be correctly rendered", () => {
        render(<GenericInput label="test"/>);
        const input = screen.getByText(/test/i);
        expect(input).toBeInTheDocument();
    });

    
});