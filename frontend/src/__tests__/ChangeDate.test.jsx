import ChangeDate from "../components/ChangeDate";
import { render, screen } from "@testing-library/react";
import { expect } from "vitest";
import api from "../api";
import userEvent from '@testing-library/user-event';

describe(ChangeDate, () => {

    vi.mock("../api", () => ({
        default: {
            post: vi.fn(),
        }
    }));

    it("Change Date form should be correctly rendered with the change date input field", () => {
        render(<ChangeDate />);
        expect(screen.getByLabelText(/change date/i)).toBeInTheDocument();
    });


    it("Change date form should be successfully submitted with a valid date and the user should be navigated to the dashboard", async () => {
        api.post.mockResolvedValue({ status: 201 });
    })

})