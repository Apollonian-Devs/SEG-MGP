import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect} from 'vitest';
import StatusHistoryButton from '../components/StatusHistoryButton';
import api from "../api";


vi.mock("../api");

describe("StatusHistoryButton", () => {

  it("fetches status history correctly",async()=>{
    api.get.mockResolvedValue({
        data: {
          status_history:[
              {notes:"note 1"}
            ]
        },
    });
    render(<StatusHistoryButton/>);
    await waitFor(() => expect(screen.getByText("note 1")).toBeInTheDocument());
    
  })

  it("fetches status history with console error",async()=>{
      //console log test adapted from https://stackoverflow.com/questions/76042978/in-vitest-how-do-i-assert-that-a-console-log-happened
      api.get.mockRejectedValue(new Error("test fetch error"));
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    
      render(<StatusHistoryButton/>);

      
      await waitFor(() => {
        expect(consoleErrorSpy).toHaveBeenCalledWith(
          "Error fetching status history:", 
          "test fetch error"
        );
      });
      consoleErrorSpy.mockRestore();
    });
    it("fetches status history with error data",async()=>{
    api.get.mockRejectedValue({ 
      response: {
        data: "fetch error data",
      },
    });
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
  
    render(<StatusHistoryButton/>);

    
    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "Error fetching status history:", 
        "fetch error data"
      );
    });
    consoleErrorSpy.mockRestore();
  });

})