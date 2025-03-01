import GenericInput from "../components/GenericInput";
import { render, screen } from "@testing-library/react";

describe(GenericInput, () => {

    it("Generic input should be correctly rendered with the correct given label", () => {
        render(<GenericInput label="test" />);
        expect(screen.getByText(/test/i)).toBeInTheDocument();
    });

    it("Generic input should be correctly rendered with the correct given placeholder", () => {
        render(<GenericInput placeholder="placeholder-test" />);
        expect(screen.getByPlaceholderText(/placeholder-test/i)).toBeInTheDocument();
    })

    it("Generic input should be correctly rendered with the correct given type", () => {
        render(<GenericInput type="button" />);
        expect(screen.getByRole('button')).toBeInTheDocument();
    })
});