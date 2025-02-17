import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import TicketsCard from '../components/TicketsCard';
import api from "../api";

vi.mock("../api");

describe("TicketsCard", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("fetches tickets correctly",async()=>{
        api.get.mockResolvedValue({
            data: {
              tickets: [{ id: 1, subject: "ticket 1", status: "test status" }],
            },
        });
        render(<TicketsCard user={{}} officers={{}} openPopup={()=>{}}/>);
       
        await waitFor(() => expect(screen.getByText("ticket 1")).toBeInTheDocument());
        
    })

    it("ticket fetch fails with console log", async () => {
        //console log test adapted from https://stackoverflow.com/questions/76042978/in-vitest-how-do-i-assert-that-a-console-log-happened
         api.get.mockRejectedValue(new Error("test fetch ticket error"));
         const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
       
         render(<TicketsCard user={{}} officers={{}} openPopup={()=>{}}/>);
         
         await waitFor(() => {
           expect(consoleErrorSpy).toHaveBeenCalledWith(
             "Error fetching tickets:", 
             "test fetch ticket error"
           );
         });
         consoleErrorSpy.mockRestore();
       });

       it("ticket fetch fails with error data", async () => {
         api.get.mockRejectedValue({ 
            response: {
                data: "fetch ticket error data",
          },
        });
         const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
       
         render(<TicketsCard user={{}} officers={{}} openPopup={()=>{}}/>);
         
         await waitFor(() => {
           expect(consoleErrorSpy).toHaveBeenCalledWith(
             "Error fetching tickets:", 
             "fetch ticket error data"
           );
         });
         consoleErrorSpy.mockRestore();
       });

     it("sort ticket subject clicked",async()=>{
        api.get.mockResolvedValue({
            data: {
              tickets: [
                { id: 1, subject: "ticket 1", status: "test status" },
                { id: 2, subject: "ticket 2", status: "test status" },
              ],
            },
        });
        render(<TicketsCard user={{}} officers={{}} openPopup={()=>{}}/>);
       
        await waitFor(() => screen.getByText("ticket 1"));
        fireEvent.click(screen.getByText("Subject").closest("button"));
        await waitFor(() => expect(screen.getByText("▲")).toBeInTheDocument());
        const rowsAsc = screen.getAllByRole("row");
        expect(within(rowsAsc[1]).getByText("ticket 1")).toBeInTheDocument();
        expect(within(rowsAsc[2]).getByText("ticket 2")).toBeInTheDocument();
        fireEvent.click(screen.getByText("Subject").closest("button"));
        await waitFor(() => expect(screen.getByText("▼")).toBeInTheDocument());
        const rowsDesc = screen.getAllByRole("row");
        expect(within(rowsDesc[1]).getByText("ticket 2")).toBeInTheDocument();
        expect(within(rowsDesc[2]).getByText("ticket 1")).toBeInTheDocument();
    })
    
    it("equal key value when sorted",async()=>{
        api.get.mockResolvedValue({
            data: {
              tickets: [
                { id: 1, subject: "ticket 1", status: "test status" },
                { id: 2, subject: "ticket 2", status: "test status" },
              ],
            },
        });
        render(<TicketsCard user={{}} officers={{}} openPopup={()=>{}}/>);
       
        await waitFor(() => screen.getByText("ticket 1"));
        fireEvent.click(screen.getByText("Status").closest("button"));
        await waitFor(() => expect(screen.getByText("▲")).toBeInTheDocument());
        const rowsAsc = screen.getAllByRole("row");
        expect(within(rowsAsc[1]).getByText("test status")).toBeInTheDocument();
        expect(within(rowsAsc[2]).getByText("test status")).toBeInTheDocument();

    })

    it("chat button clicked and closed",async()=>{
        api.get.mockResolvedValue({
            data: {
              tickets: [
                { id: 1, subject: "ticket 1", status: "test status", },
                
              ],
              messages:[
                {body:"message 1"}
              ]
            },
        });
        render(<TicketsCard user={{}} officers={{}} openPopup={()=>{}}/>);
       
        await waitFor(() => screen.getByText("ticket 1"));
        fireEvent.click(screen.getByText("Chat").closest("button"));
        await waitFor(() => expect(screen.getByText("message 1")).toBeInTheDocument());
        const buttons = screen.getAllByRole("button");
        fireEvent.click(buttons[1]);
        await waitFor(() => expect(screen.getByText("Chat")).toBeInTheDocument());
        fireEvent.click(screen.getByText("Chat").closest("button"));
        const buttons2 = screen.getAllByRole("button");
        fireEvent.click(buttons2[0]);
        await waitFor(() => expect(screen.getByText("Chat")).toBeInTheDocument());
    })

    it("sort ticket status clicked",async()=>{
        api.get.mockResolvedValue({
            data: {
              tickets: [
                { id: 1, subject: "ticket 1", status: "test status 1" },
                { id: 2, subject: "ticket 2", status: "test status 2" },
              ],
            },
        });
        render(<TicketsCard user={{}} officers={{}} openPopup={()=>{}}/>);
       
        await waitFor(() => screen.getByText("ticket 1"));
        fireEvent.click(screen.getByText("Status").closest("button"));
        await waitFor(() => expect(screen.getByText("▲")).toBeInTheDocument());
        const rowsAsc = screen.getAllByRole("row");
        expect(within(rowsAsc[1]).getByText("test status 1")).toBeInTheDocument();
        expect(within(rowsAsc[2]).getByText("test status 2")).toBeInTheDocument();
        fireEvent.click(screen.getByText("Status").closest("button"));
        await waitFor(() => expect(screen.getByText("▼")).toBeInTheDocument());
        const rowsDesc = screen.getAllByRole("row");
        expect(within(rowsDesc[1]).getByText("test status 2")).toBeInTheDocument();
        expect(within(rowsDesc[2]).getByText("test status 1")).toBeInTheDocument();
    })

    it("sort ticket priority clicked",async()=>{
        api.get.mockResolvedValue({
            data: {
              tickets: [
                { id: 1, subject: "ticket 1", status: "test status", priority: "Low" },
                { id: 2, subject: "ticket 2", status: "test status",priority: "High" },
              ],
            },
        });
        render(<TicketsCard user={{}} officers={{}} openPopup={()=>{}}/>);
       
        await waitFor(() => screen.getByText("ticket 1"));
        fireEvent.click(screen.getByText("Priority").closest("button"));
        await waitFor(() => expect(screen.getByText("▲")).toBeInTheDocument());
        const rowsAsc = screen.getAllByRole("row");
        expect(within(rowsAsc[1]).getByText("High")).toBeInTheDocument();
        expect(within(rowsAsc[2]).getByText("Low")).toBeInTheDocument();
        fireEvent.click(screen.getByText("Priority").closest("button"));
        await waitFor(() => expect(screen.getByText("▼")).toBeInTheDocument());
        const rowsDesc = screen.getAllByRole("row");
        expect(within(rowsDesc[1]).getByText("Low")).toBeInTheDocument();
        expect(within(rowsDesc[2]).getByText("High")).toBeInTheDocument();
        

        
    })



    it("fetches tickets correctly",async()=>{
        api.get.mockResolvedValue({
            data: {
              tickets: [{ id: 1, subject: "ticket 1", status: "test status" }],
            },
        });
        render(<TicketsCard user={{is_staff: true}} officers={{}} openPopup={()=>{}}/>);
       
        await waitFor(() => expect(screen.getByText("Redirect")).toBeInTheDocument());
        
    })

    it("sort ticket with null value",async()=>{
        api.get.mockResolvedValue({
            data: {
              tickets: [
                { id: 1, subject: "ticket 1", status: null },
                { id: 2, subject: "ticket 2", status: null },
              ],
            },
        });
        render(<TicketsCard user={{}} officers={{}} openPopup={()=>{}}/>);
       
        await waitFor(() => screen.getByText("ticket 1"));
        fireEvent.click(screen.getByText("Status").closest("button"));
        await waitFor(() => expect(screen.getByText("▲")).toBeInTheDocument());
        const rowsAsc = screen.getAllByRole("row");
        expect(within(rowsAsc[1]).getByText("ticket 1")).toBeInTheDocument();
        expect(within(rowsAsc[2]).getByText("ticket 2")).toBeInTheDocument();

    })

    it("click ticket row",async()=>{
        api.get.mockResolvedValue({
            data: {
              tickets: [
                { id: 1, subject: "ticket 1", status: "test status" },
              ],
            },
        });
        render(<TicketsCard user={{}} officers={{}} openPopup={()=>{}}/>);
       
        await waitFor(() => screen.getByText("ticket 1"));
        fireEvent.click(screen.getByText("ticket 1").closest("tr"));
        await waitFor(() => expect(screen.getByText("ticket 1")).toBeInTheDocument());
      
    })
  
    it("sort tickets with more data",async()=>{
        api.get.mockResolvedValue({
            data: {
              tickets: [
                { id: 1, subject: "ticket 1", status: "test status" },
                { id: 2, subject: "ticket 2", status: "test status" },
                { id: 3, subject: "ticket 3", status: "test status" },
                { id: 4, subject: "ticket 4", status: "test status" },
              ],
            },
        });
        render(<TicketsCard user={{}} officers={{}} openPopup={()=>{}}/>);
       
        await waitFor(() => screen.getByText("ticket 1"));
        fireEvent.click(screen.getByText("Subject").closest("button"));
        await waitFor(() => expect(screen.getByText("▲")).toBeInTheDocument());
        const rowsAsc = screen.getAllByRole("row");
        expect(within(rowsAsc[1]).getByText("ticket 1")).toBeInTheDocument();
        expect(within(rowsAsc[4]).getByText("ticket 4")).toBeInTheDocument();
        fireEvent.click(screen.getByText("Subject").closest("button"));
        await waitFor(() => expect(screen.getByText("▼")).toBeInTheDocument());
        const rowsDesc = screen.getAllByRole("row");
        expect(within(rowsDesc[1]).getByText("ticket 4")).toBeInTheDocument();
        expect(within(rowsDesc[4]).getByText("ticket 1")).toBeInTheDocument();
    })
    
})