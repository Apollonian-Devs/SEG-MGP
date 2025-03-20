import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import NotificationsTab from '../components/Notification';
import api from "../api";
import { vi } from "vitest";
import { toast } from "sonner";  


vi.mock("../api");

beforeAll(() => {
  window.HTMLMediaElement.prototype.play = vi.fn().mockImplementation(() => Promise.resolve());
});



vi.mock("sonner", () => ({
  toast: {
    error: vi.fn(),
    success: vi.fn(),
  },
}));

describe("NotificationsTab", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });
    it("fetches notifications correctly",async()=>{
        api.get.mockResolvedValue({
            data: {
              notifications: [{ id: 1, message: "Notification 1", ticket_subject: "test subject" }],
            },
        });
        render(<NotificationsTab user={{}}/>);
        fireEvent.click(screen.getByRole("button"));
        await waitFor(() => expect(screen.getByText("Notification 1")).toBeInTheDocument());
        
    })

    it("notification fetch fails with console log", async () => {
       //console log test adapted from https://stackoverflow.com/questions/76042978/in-vitest-how-do-i-assert-that-a-console-log-happened
        api.get.mockRejectedValue(new Error("test fetch error"));
        const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      
        render(<NotificationsTab user={{}}/>);
        fireEvent.click(screen.getByRole("button")); 
        
        await waitFor(() => {
          // expect(consoleErrorSpy).toHaveBeenCalledWith(
          //   "Error fetching notifications:", 
          //   "test fetch error"
          // );
          expect(toast.error).toHaveBeenCalledWith("❌ Error fetching notifications");
        });
        consoleErrorSpy.mockRestore();
      });

      it("notification fetch fails with error data", async () => {
        api.get.mockRejectedValue({ 
            response: {
                data: "fetch error data",
          },
        });
        const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      
        render(<NotificationsTab user={{}}/>);
        fireEvent.click(screen.getByRole("button")); 
        
        await waitFor(() => {
          // expect(consoleErrorSpy).toHaveBeenCalledWith(
          //   "Error fetching notifications:", 
          //   "fetch error data"
          // );
          expect(toast.error).toHaveBeenCalledWith(expect.stringMatching(/Error/));
          // expect(consoleErrorSpy).toHaveBeenCalledWith(
          //   "Error marking notifications as read:",
          //   expect.any(Error)
          // );
                    
        });
        consoleErrorSpy.mockRestore();
      });

    it("marks notifications correctly", async () => {
        api.get.mockResolvedValue({
            data: {
              notifications: [{ id: 1, message: "Notification 1", ticket_subject: "test subject" }],
            },
        });
        api.post.mockResolvedValue({ data: { success: true } });
        render(<NotificationsTab user={{}}/>);
        fireEvent.click(screen.getByRole("button"));
        await waitFor(() => screen.getByText("Notification 1"));
        fireEvent.click(screen.getByText('Notification 1').closest('tr'));
        const buttons = screen.getAllByRole("button");
        fireEvent.click(buttons[1]);
        expect(api.post).toHaveBeenCalledTimes(1); 
    });

    it("marks notifications with error", async () => {
        api.get.mockResolvedValue({
            data: {
              notifications: [{ id: 1, message: "Notification 1", ticket_subject: "test subject" }],
            },
        });
        api.post.mockRejectedValue(new Error("test post error"));
        const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
        render(<NotificationsTab user={{}}/>);
        fireEvent.click(screen.getByRole("button"));
        await waitFor(() => screen.getByText("Notification 1"));
        fireEvent.click(screen.getByText('Notification 1').closest('tr'));
        const buttons = screen.getAllByRole("button");
        fireEvent.click(buttons[1]);
        await waitFor(() => {
            // expect(consoleErrorSpy).toHaveBeenCalledWith(
            //   "Error marking notifications as read:", 
            //   "test post error"
            // );
            expect(toast.error).toHaveBeenCalledWith(expect.stringMatching(/Error/));
          });
          consoleErrorSpy.mockRestore();
    });

    it("marks notifications with error data", async () => {
        api.get.mockResolvedValue({
            data: {
              notifications: [{ id: 1, message: "Notification 1", ticket_subject: "test subject" }],
            },
        });
        api.post.mockRejectedValue({
            response: {
                data: "mark error data",
              },
        });
        const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
        render(<NotificationsTab user={{}}/>);
        fireEvent.click(screen.getByRole("button"));
        await waitFor(() => screen.getByText("Notification 1"));
        fireEvent.click(screen.getByText('Notification 1').closest('tr'));
        const buttons = screen.getAllByRole("button");
        fireEvent.click(buttons[1]);
        await waitFor(() => {
            // expect(consoleErrorSpy).toHaveBeenCalledWith(
            //   "Error marking notifications as read:", 
            //   "mark error data"
            // );
            expect(toast.error).toHaveBeenCalledWith(expect.stringMatching(/Error/));
          });
          consoleErrorSpy.mockRestore();
    });

    it("unmarks notification in same session", async () => {
        api.get.mockResolvedValue({
            data: {
              notifications: [{ id: 1, message: "Notification 1", ticket_subject: "test subject" }],
            },
        });
        api.post.mockResolvedValue({ data: { success: true } });
        render(<NotificationsTab user={{}}/>);
        fireEvent.click(screen.getByRole("button"));
        await waitFor(() => screen.getByText("Notification 1"));
        fireEvent.click(screen.getByText('Notification 1').closest('tr'));
        fireEvent.click(screen.getByText('Notification 1').closest('tr'));
        const buttons = screen.getAllByRole("button");
        fireEvent.click(buttons[1]);
        expect(api.post).toHaveBeenCalledTimes(0); 
    });
    it("marks all notifications correctly", async () => {
        api.get.mockResolvedValue({
            data: {
              notifications: [{ id: 1, message: "Notification 1", ticket_subject: "test subject" }],
            },
        });
        api.post.mockResolvedValue({ data: { success: true } });
        render(<NotificationsTab user={{}}/>);
        fireEvent.click(screen.getByRole("button"));
        await waitFor(() => screen.getByText("Notification 1"));
       
        const buttons = screen.getAllByRole("button");
        fireEvent.click(buttons[2]);
        fireEvent.click(buttons[1]);
        expect(api.post).toHaveBeenCalledTimes(1); 
    });
     it("marks notifications with error", async () => {
        api.get.mockResolvedValue({
            data: {
              notifications: [{ id: 1, message: "Notification 1", ticket_subject: "test subject" }],
            },
        });
        api.post.mockRejectedValue(new Error("test post error"));
        const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
        render(<NotificationsTab user={{}}/>);
        fireEvent.click(screen.getByRole("button"));
        await waitFor(() => screen.getByText("Notification 1"));
        fireEvent.click(screen.getByText('Notification 1').closest('tr'));
        const buttons = screen.getAllByRole("button");
        fireEvent.click(buttons[1]);
        await waitFor(() => {
            // expect(consoleErrorSpy).toHaveBeenCalledWith(
            //   "Error marking notifications as read:", 
            //   "test post error"
            // );
            expect(toast.error).toHaveBeenCalledWith(expect.stringMatching(/Error/));
          });
          consoleErrorSpy.mockRestore();
    });

   
})
