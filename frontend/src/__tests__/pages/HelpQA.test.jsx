import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import userEvent from '@testing-library/user-event';
import HelpQA, {faqData} from '../../pages/HelpQ&A';

describe("Help Q&A component", () => {
    it("renders the FAQ page heading", () => {
        render(<HelpQA />);
        expect(screen.getByText(/Frequently Asked Questions/i)).toBeInTheDocument();
    });

    it("renders all FAQ questions", () => {
        render(<HelpQA />);
        
        faqData.forEach(faq => {
            expect(screen.getByText(faq.question)).toBeInTheDocument();
        });
    });

    it("does not show any answers when the component is initially rendered", () => {
        render(<HelpQA />);
    
        faqData.forEach(faq => {
            expect(screen.queryByText(faq.answer)).not.toBeInTheDocument();
        });
    });
    

    it("reveals an answer when a question is clicked", async () => {
        render(<HelpQA />);
        
        const firstQuestion = screen.getByText(faqData[0].question);
        await userEvent.click(firstQuestion);
    
        const answer = await screen.findByText(faqData[0].answer);
        expect(answer).toBeInTheDocument();
    });

    it("hides the answer when a question is clicked twice", async () => {
        render(<HelpQA />);
        
        const firstQuestion = screen.getByText(faqData[0].question);
        await userEvent.click(firstQuestion);
        expect(await screen.findByText(faqData[0].answer)).toBeInTheDocument();
    
        await userEvent.click(firstQuestion);
        expect(screen.queryByText(faqData[0].answer)).not.toBeInTheDocument();
    });
    
})