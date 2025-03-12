import { render, screen,  waitFor } from '@testing-library/react';
import { describe, it, expect} from 'vitest';
import TicketPathButton from '../components/TicketPathButton';
import api from "../api";


vi.mock("../api");

describe("TicketPathButton", () => {

  it("fetches Ticket Path correctly",async()=>{
    api.get.mockResolvedValue({
        data: {
          ticket_path:[
              {
                from_username:"user 1",
                to_username:"user 2",
              }
            ]
        },
    });
    render(<TicketPathButton/>);
    await waitFor(() => expect(screen.getByText("user 1")).toBeInTheDocument());
    
  })

  it("fetches ticket path with console error",async()=>{
      //console log test adapted from https://stackoverflow.com/questions/76042978/in-vitest-how-do-i-assert-that-a-console-log-happened
      api.get.mockRejectedValue(new Error("test fetch path error"));
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    
      render(<TicketPathButton/>);

      
      await waitFor(() => {
        expect(consoleErrorSpy).toHaveBeenCalledWith(
          "Error fetching ticket path:", 
          "test fetch path error"
        );
      });
      consoleErrorSpy.mockRestore();
    });
    it("fetches ticket path with error data",async()=>{
    api.get.mockRejectedValue({ 
      response: {
        data: "fetch path error data",
      },
    });
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
  
    render(<TicketPathButton/>);

    
    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "Error fetching ticket path:", 
        "fetch path error data"
      );
    });
    consoleErrorSpy.mockRestore();
  });

})