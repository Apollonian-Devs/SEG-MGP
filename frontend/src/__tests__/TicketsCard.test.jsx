import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import Dashboard from '../pages/Dashboard'
import TicketsCard from '../components/TicketsCard';
import api from "../api";
import { MemoryRouter } from 'react-router-dom';
import { useState } from "react";


describe("TicketsCard", () => {
  beforeEach(() => {
      vi.clearAllMocks();
  });


  it("Tickets Card should be correctly rendered", () => {
    render(<TicketsCard user={{}} tickets={[{ id: 1, subject: "ticket 1", status: "testStatus" }]}/>);
    expect(screen.getByText("Tickets")).toBeInTheDocument();
    
    expect(screen.getByText(/subject/i)).toBeInTheDocument();
    expect(screen.getByText("Status")).toBeInTheDocument();
    expect(screen.getByText(/priority/i)).toBeInTheDocument();
    expect(screen.getByText("ticket 1")).toBeInTheDocument();
  })


  it("Tickets Card should display extra table headings if the user is a staff member", () => {
    const mockOfficer = {
      user: {
          id: 101,
          username: "@officer1",
      },
      department: "IT",
    };
    render(<TicketsCard 
      user={{is_staff: true}} 
      officers={[mockOfficer]}
      tickets={[{ id: 1, subject: "ticket 1", status: "testStatus" }]}
    />);
    screen.getByRole("button", { name: /redirect/i });
    expect(screen.getByText(/change due date/i)).toBeInTheDocument();
  })


  it("Chat popup should be displayed when the chat button is pressed", async() => {
    render(<TicketsCard 
      user={{}} 
      tickets={[{ id: 1, subject: "ticket 1", status: "testStatus" }]} 
      setSelectedTicket={vi.fn()} 
      setTickets={vi.fn()}
    />);

    await waitFor(() => screen.getByText("ticket 1"));
    fireEvent.click(screen.getByText("Chat").closest("button"));
    // await waitFor(() => expect(screen.getByText("message 1")).toBeInTheDocument());
    const buttons = screen.getAllByRole("button");
    fireEvent.click(buttons[1]);
    await waitFor(() => expect(screen.getByText("Chat")).toBeInTheDocument());
    fireEvent.click(screen.getByText("Chat").closest("button"));
    const buttons2 = screen.getAllByRole("button");
    fireEvent.click(buttons2[0]);
    await waitFor(() => expect(screen.getByText("Chat")).toBeInTheDocument());
  })


  it("Change date popup should be displayed when the change date button is presed", async() => {
    const mockOfficer = {
      user: {
          id: 101,
          username: "@officer1",
      },
      department: "IT",
    };
    
    render(<MemoryRouter><TicketsCard 
      user={{is_staff: true}} 
      officers={[mockOfficer]}
      tickets={[{ id: 1, subject: "ticket 1", status: "testStatus" }]} 
      setSelectedTicket={vi.fn()} 
      setTickets={vi.fn()}
      selectedTicket={{ id: 1, subject: "ticket 1", status: "testStatus" }}
    /></MemoryRouter>);
    
    await waitFor(() => screen.getByText("ticket 1"));
    fireEvent.click(screen.getByText("Select Date").closest("button"));
    await waitFor(() => expect(screen.getByText(/change date/i)).toBeInTheDocument());


  })

    
  it("Clicking on the row of a ticket should open the details popup", async() => {
    render(<TicketsCard 
      user={{}} 
      tickets={[{ id: 1, subject: "ticket 1", status: "testStatus", due_date: "2025-12-31"}]} 
      setSelectedTicket={vi.fn()} 
      setTickets={vi.fn()}
      openPopup={vi.fn()}
    />);

    const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});

    await waitFor(() => screen.getByRole('cell', {name: /ticket 1/i}));
    fireEvent.click(screen.getByText(/ticket 1/i).closest("tr"));

    expect(consoleSpy).toHaveBeenCalledWith("Selected Ticket ID: 1, Due Date: 2025-12-31");

  })
    

  // Wrapper written by GPT
  const SubjectAndSameStatusTest = () => {
    const [tickets, setTickets] = useState([
      { id: 1, subject: "ticket 1", status: "test status" },
      { id: 2, subject: "ticket 2", status: "test status" },
    ]);
  
    return (
      <TicketsCard
        user={{}}
        tickets={tickets}
        setSelectedTicket={vi.fn()}
        setTickets={setTickets}
      />
    );
  };

  it("Tickets are correctly sorted by subject when subject is clicked", async () => {
    render(<SubjectAndSameStatusTest />);

    await waitFor(() => screen.getByText("ticket 1"));
    await waitFor(() => screen.getByText("ticket 2"));
    
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

  it("Sorting is handled correctly when status is clicked and both status's are the same", async() => {
    render(<SubjectAndSameStatusTest />);

    await waitFor(() => screen.getByText("ticket 1"));
    fireEvent.click(screen.getByText("Status").closest("button"));
    await waitFor(() => expect(screen.getByText("▲")).toBeInTheDocument());
    const rowsAsc = screen.getAllByRole("row");
    expect(within(rowsAsc[1]).getByText("test status")).toBeInTheDocument();
    expect(within(rowsAsc[2]).getByText("test status")).toBeInTheDocument();
  })
  

  const DifferentStatusTest = () => {
    const [tickets, setTickets] = useState([
      { id: 1, subject: "ticket 1", status: "test status a" },
      { id: 2, subject: "ticket 2", status: "test status b" },
    ]);

    return (
      <TicketsCard
        user={{}}
        tickets={tickets}
        setSelectedTicket={vi.fn()}
        setTickets={setTickets}
      />
    );
  };

  it("Tickets are correctly sorted by status when status is clicked", async() => {
    render(<DifferentStatusTest />);

    await waitFor(() => screen.getByText("ticket 1"));
    fireEvent.click(screen.getByText("Status").closest("button"));
    await waitFor(() => expect(screen.getByText("▲")).toBeInTheDocument());
    const rowsAsc = screen.getAllByRole("row");
    expect(within(rowsAsc[1]).getByText("test status a")).toBeInTheDocument();
    expect(within(rowsAsc[2]).getByText("test status b")).toBeInTheDocument();
    fireEvent.click(screen.getByText("Status").closest("button"));
    await waitFor(() => expect(screen.getByText("▼")).toBeInTheDocument());
    const rowsDesc = screen.getAllByRole("row");
    expect(within(rowsDesc[1]).getByText("test status b")).toBeInTheDocument();
    expect(within(rowsDesc[2]).getByText("test status a")).toBeInTheDocument();

  })

  const DifferentPrioritiesTest = () => {
    const [tickets, setTickets] = useState([
      { id: 1, subject: "ticket 1", status: "test status", priority: "Low" },
      { id: 2, subject: "ticket 2", status: "test status", priority: "High" },
    ]);

    return (
      <TicketsCard
        user={{}}
        tickets={tickets}
        setSelectedTicket={vi.fn()}
        setTickets={setTickets}
      />
    );
  };

  it("Tickets are correctly sorted by priority when priority is clicked", async() => {
    render(<DifferentPrioritiesTest />);

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







 // -------------------------------- OLD TESTS -------------------------------- //


  //   it("fetches tickets correctly",async()=>{
  //       api.get.mockResolvedValue({
  //           data: {
  //             tickets: [{ id: 1, subject: "ticket 1", status: "test status" }],
  //           },
  //       });
  //       render(<TicketsCard user={{}} officers={{}} openPopup={()=>{}}/>);
       
  //       await waitFor(() => expect(screen.getByText("ticket 1")).toBeInTheDocument());
        
  //   })

  //   it("ticket fetch fails with console log", async () => {
  //       //console log test adapted from https://stackoverflow.com/questions/76042978/in-vitest-how-do-i-assert-that-a-console-log-happened
  //        api.get.mockRejectedValue(new Error("test fetch ticket error"));
  //        const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
       
  //        render(<TicketsCard user={{}} officers={{}} openPopup={()=>{}}/>);
         
  //        await waitFor(() => {
  //          expect(consoleErrorSpy).toHaveBeenCalledWith(
  //            "Error fetching tickets:", 
  //            "test fetch ticket error"
  //          );
  //        });
  //        consoleErrorSpy.mockRestore();
  //      });

  //      it("ticket fetch fails with error data", async () => {
  //        api.get.mockRejectedValue({ 
  //           response: {
  //               data: "fetch ticket error data",
  //         },
  //       });
  //        const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
       
  //        render(<TicketsCard user={{}} officers={{}} openPopup={()=>{}}/>);
         
  //        await waitFor(() => {
  //          expect(consoleErrorSpy).toHaveBeenCalledWith(
  //            "Error fetching tickets:", 
  //            "fetch ticket error data"
  //          );
  //        });
  //        consoleErrorSpy.mockRestore();
  //      });

    //  it("sort ticket subject clicked",async()=>{
    //     api.get.mockResolvedValue({
    //         data: {
    //           tickets: [
    //             { id: 1, subject: "ticket 1", status: "test status" },
    //             { id: 2, subject: "ticket 2", status: "test status" },
    //           ],
    //         },
    //     });
    //     render(<TicketsCard user={{}} officers={{}} openPopup={()=>{}}/>);
       
    //     await waitFor(() => screen.getByText("ticket 1"));
    //     fireEvent.click(screen.getByText("Subject").closest("button"));
    //     await waitFor(() => expect(screen.getByText("▲")).toBeInTheDocument());
    //     const rowsAsc = screen.getAllByRole("row");
    //     expect(within(rowsAsc[1]).getByText("ticket 1")).toBeInTheDocument();
    //     expect(within(rowsAsc[2]).getByText("ticket 2")).toBeInTheDocument();
    //     fireEvent.click(screen.getByText("Subject").closest("button"));
    //     await waitFor(() => expect(screen.getByText("▼")).toBeInTheDocument());
    //     const rowsDesc = screen.getAllByRole("row");
    //     expect(within(rowsDesc[1]).getByText("ticket 2")).toBeInTheDocument();
    //     expect(within(rowsDesc[2]).getByText("ticket 1")).toBeInTheDocument();
    // })
    


  //   it("equal key value when sorted",async()=>{
  //       api.get.mockResolvedValue({
  //           data: {
  //             tickets: [
  //               { id: 1, subject: "ticket 1", status: "test status" },
  //               { id: 2, subject: "ticket 2", status: "test status" },
  //             ],
  //           },
  //       });
  //       render(<TicketsCard user={{}} officers={{}} openPopup={()=>{}}/>);
       
  //       await waitFor(() => screen.getByText("ticket 1"));
  //       fireEvent.click(screen.getByText("Status").closest("button"));
  //       await waitFor(() => expect(screen.getByText("▲")).toBeInTheDocument());
  //       const rowsAsc = screen.getAllByRole("row");
  //       expect(within(rowsAsc[1]).getByText("test status")).toBeInTheDocument();
  //       expect(within(rowsAsc[2]).getByText("test status")).toBeInTheDocument();

  //   })

  //   it("chat button clicked and closed",async()=>{
  //       api.get.mockResolvedValue({
  //           data: {
  //             tickets: [
  //               { id: 1, subject: "ticket 1", status: "test status", },
                
  //             ],
  //             messages:[
  //               {body:"message 1"}
  //             ]
  //           },
  //       });
  //       render(<TicketsCard user={{}} officers={{}} openPopup={()=>{}}/>);
       
  //       await waitFor(() => screen.getByText("ticket 1"));
  //       fireEvent.click(screen.getByText("Chat").closest("button"));
  //       await waitFor(() => expect(screen.getByText("message 1")).toBeInTheDocument());
  //       const buttons = screen.getAllByRole("button");
  //       fireEvent.click(buttons[1]);
  //       await waitFor(() => expect(screen.getByText("Chat")).toBeInTheDocument());
  //       fireEvent.click(screen.getByText("Chat").closest("button"));
  //       const buttons2 = screen.getAllByRole("button");
  //       fireEvent.click(buttons2[0]);
  //       await waitFor(() => expect(screen.getByText("Chat")).toBeInTheDocument());
  //   })

  //   it("sort ticket status clicked",async()=>{
  //       api.get.mockResolvedValue({
  //           data: {
  //             tickets: [
  //               { id: 1, subject: "ticket 1", status: "test status 1" },
  //               { id: 2, subject: "ticket 2", status: "test status 2" },
  //             ],
  //           },
  //       });
  //       render(<TicketsCard user={{}} officers={{}} openPopup={()=>{}}/>);
       
  //       await waitFor(() => screen.getByText("ticket 1"));
  //       fireEvent.click(screen.getByText("Status").closest("button"));
  //       await waitFor(() => expect(screen.getByText("▲")).toBeInTheDocument());
  //       const rowsAsc = screen.getAllByRole("row");
  //       expect(within(rowsAsc[1]).getByText("test status 1")).toBeInTheDocument();
  //       expect(within(rowsAsc[2]).getByText("test status 2")).toBeInTheDocument();
  //       fireEvent.click(screen.getByText("Status").closest("button"));
  //       await waitFor(() => expect(screen.getByText("▼")).toBeInTheDocument());
  //       const rowsDesc = screen.getAllByRole("row");
  //       expect(within(rowsDesc[1]).getByText("test status 2")).toBeInTheDocument();
  //       expect(within(rowsDesc[2]).getByText("test status 1")).toBeInTheDocument();
  //   })

  //   it("sort ticket priority clicked",async()=>{
  //       api.get.mockResolvedValue({
  //           data: {
  //             tickets: [
  //               { id: 1, subject: "ticket 1", status: "test status", priority: "Low" },
  //               { id: 2, subject: "ticket 2", status: "test status",priority: "High" },
  //             ],
  //           },
  //       });
  //       render(<TicketsCard user={{}} officers={{}} openPopup={()=>{}}/>);
       
  //       await waitFor(() => screen.getByText("ticket 1"));
  //       fireEvent.click(screen.getByText("Priority").closest("button"));
  //       await waitFor(() => expect(screen.getByText("▲")).toBeInTheDocument());
  //       const rowsAsc = screen.getAllByRole("row");
  //       expect(within(rowsAsc[1]).getByText("High")).toBeInTheDocument();
  //       expect(within(rowsAsc[2]).getByText("Low")).toBeInTheDocument();
  //       fireEvent.click(screen.getByText("Priority").closest("button"));
  //       await waitFor(() => expect(screen.getByText("▼")).toBeInTheDocument());
  //       const rowsDesc = screen.getAllByRole("row");
  //       expect(within(rowsDesc[1]).getByText("Low")).toBeInTheDocument();
  //       expect(within(rowsDesc[2]).getByText("High")).toBeInTheDocument();
        

        
  //   })


  //   it("fetches tickets correctly", async () => {
  //     api.get.mockResolvedValue({
  //         data: {
  //             tickets: [{ id: 1, subject: "ticket 1", status: "test status" }],
  //         },
  //     });
  
  //     const mockOfficer = {
  //         user: {
  //             id: 101,
  //             username: "@officer1",
  //         },
  //         department: "IT",
  //     };
  
  //     render(
  //         <TicketsCard
  //             user={{ is_staff: true }}
  //             officers={[mockOfficer]} // Passing one officer
  //             openPopup={() => {}}
  //         />
  //     );
  
  //     // Use getByRole to avoid multiple elements error
  //     await waitFor(() =>
  //         expect(screen.getByRole("button", { name: "Redirect" })).toBeInTheDocument()
  //     );
  // });
  
  

  //   it("sort ticket with null value",async()=>{
  //       api.get.mockResolvedValue({
  //           data: {
  //             tickets: [
  //               { id: 1, subject: "ticket 1", status: null },
  //               { id: 2, subject: "ticket 2", status: null },
  //             ],
  //           },
  //       });
  //       render(<TicketsCard user={{}} officers={{}} openPopup={()=>{}}/>);
       
  //       await waitFor(() => screen.getByText("ticket 1"));
  //       fireEvent.click(screen.getByText("Status").closest("button"));
  //       await waitFor(() => expect(screen.getByText("▲")).toBeInTheDocument());
  //       const rowsAsc = screen.getAllByRole("row");
  //       expect(within(rowsAsc[1]).getByText("ticket 1")).toBeInTheDocument();
  //       expect(within(rowsAsc[2]).getByText("ticket 2")).toBeInTheDocument();

  //   })

  //   it("click ticket row",async()=>{
  //       api.get.mockResolvedValue({
  //           data: {
  //             tickets: [
  //               { id: 1, subject: "ticket 1", status: "test status" },
  //             ],
  //           },
  //       });
  //       render(<TicketsCard user={{}} officers={{}} openPopup={()=>{}}/>);
       
  //       await waitFor(() => screen.getByText("ticket 1"));
  //       fireEvent.click(screen.getByText("ticket 1").closest("tr"));
  //       await waitFor(() => expect(screen.getByText("ticket 1")).toBeInTheDocument());
      
  //   })
  
  //   it("sort tickets with more data",async()=>{
  //       api.get.mockResolvedValue({
  //           data: {
  //             tickets: [
  //               { id: 1, subject: "ticket 1", status: "test status" },
  //               { id: 2, subject: "ticket 2", status: "test status" },
  //               { id: 3, subject: "ticket 3", status: "test status" },
  //               { id: 4, subject: "ticket 4", status: "test status" },
  //             ],
  //           },
  //       });
  //       render(<TicketsCard user={{}} officers={{}} openPopup={()=>{}}/>);
       
  //       await waitFor(() => screen.getByText("ticket 1"));
  //       fireEvent.click(screen.getByText("Subject").closest("button"));
  //       await waitFor(() => expect(screen.getByText("▲")).toBeInTheDocument());
  //       const rowsAsc = screen.getAllByRole("row");
  //       expect(within(rowsAsc[1]).getByText("ticket 1")).toBeInTheDocument();
  //       expect(within(rowsAsc[4]).getByText("ticket 4")).toBeInTheDocument();
  //       fireEvent.click(screen.getByText("Subject").closest("button"));
  //       await waitFor(() => expect(screen.getByText("▼")).toBeInTheDocument());
  //       const rowsDesc = screen.getAllByRole("row");
  //       expect(within(rowsDesc[1]).getByText("ticket 4")).toBeInTheDocument();
  //       expect(within(rowsDesc[4]).getByText("ticket 1")).toBeInTheDocument();
  //   })
    
    it("status history button clicked and closed",async()=>{
      api.get.mockResolvedValue({
          data: {
            tickets: [
              { id: 1, subject: "ticket 1", status: "test status", },
              
            ],
            status_history:[
              {notes:"note 1"}
            ]
          },
      });
      const mockOfficer = {
        user: {
            id: 101,
            username: "@officer1",
        },
        department: "IT",
      };

      render(
          <TicketsCard
              user={{ is_staff: true }}
              officers={[mockOfficer]} 
              openPopup={() => {}}
          />
      );
      await waitFor(() =>
        expect(screen.getByRole("button", { name: "Status History" })).toBeInTheDocument()
      );
      
      fireEvent.click(screen.getByRole("button", { name: "Status History" }));
      await waitFor(() => expect(screen.getByText("note 1")).toBeInTheDocument());
      const buttons = screen.getAllByRole("button");
      fireEvent.click(buttons[1]);
      await waitFor(() =>
        expect(screen.getByRole("button", { name: "Status History" })).toBeInTheDocument()
      );
      fireEvent.click(screen.getByRole("button", { name: "Status History" }));
      const buttons2 = screen.getAllByRole("button");
      fireEvent.click(buttons2[0]);
      await waitFor(() =>
        expect(screen.getByRole("button", { name: "Status History" })).toBeInTheDocument()
      );

      
  })

 
})