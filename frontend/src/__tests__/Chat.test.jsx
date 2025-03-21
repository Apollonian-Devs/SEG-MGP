import Chat from "../components/Chat";
import { render, screen, waitFor, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import api from "../api";  // The module your Chat component uses
import { ACCESS_TOKEN } from "../constants";
import { vi } from "vitest";

HTMLMediaElement.prototype.play = () => Promise.resolve();

vi.mock("../api");

describe("Chat", () => {
  beforeEach(() => {
    vi.restoreAllMocks(); 
    localStorage.setItem(ACCESS_TOKEN, "token");
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  // 1) Test the loading state
  it("should render loading message initially", async () => {

    api.get.mockReturnValue(new Promise(() => {}));

    await act(async () => {
      render(
        <Chat
          ticket={{ id: 1, subject: "Test Ticket" }}
          onClose={() => {}}
          user={{ id: 1, username: "User" }}
        />
      );
    });

    expect(screen.getByText("Loading messages...")).toBeInTheDocument();
  });

  it("fetches the message for a given ticket", async () => {
    const ticket = { id: 1, subject: "Test Ticket" };

    api.get.mockResolvedValueOnce({
      data: {
        messages: [
          {
            message_id: 1,
            sender: "User",
            body: "Hello",
            created_at: new Date().toISOString(),
            sender_role: "role",
          },
        ],
      },
    });

    await act(async () => {
      render(
        <Chat
          ticket={ticket}
          onClose={() => {}}
          user={{ id: 1, username: "User" }}
        />
      );
    });

    await waitFor(() => {
      expect(api.get).toHaveBeenCalledWith("/api/tickets/1/messages/", {
        headers: { Authorization: "Bearer token" },
      });
    });

    expect(screen.getByText("Hello")).toBeInTheDocument();
  });


  it("should send a message", async () => {
    const ticket = { id: 1, subject: "Test Ticket" };

    api.get.mockResolvedValueOnce({
      data: { messages: [] },
    });

    api.post.mockResolvedValueOnce({
      data: {
        message_id: 2,
        sender: "User",
        body: "Hello",
        created_at: new Date().toISOString(),
        sender_role: "role",
      },
    });

    api.get.mockResolvedValueOnce({
      data: {
        messages: [
          {
            message_id: 2,
            sender: "User",
            body: "Hello",
            created_at: new Date().toISOString(),
            sender_role: "role",
          },
        ],
      },
    });

    await act(async () => {
      render(
        <Chat
          ticket={ticket}
          onClose={() => {}}
          user={{ id: 1, username: "User" }}
        />
      );
    });

    await waitFor(() => {
      expect(api.get).toHaveBeenCalledWith("/api/tickets/1/messages/", {
        headers: { Authorization: "Bearer token" },
      });
    });

    const input = screen.getByPlaceholderText("Enter your message");
    const submitButton = screen.getByRole("button", { name: "Send" });

    await userEvent.type(input, "Hello");
    await userEvent.click(submitButton);

    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith(
        "/api/tickets/1/messages/post/",
        { message_body: "Hello",
          attachments: []
        },
        { headers: { Authorization: "Bearer token" } }
      );
    });

    expect(screen.getByText("Hello")).toBeInTheDocument();
  });

  it("failed to send a message (with error.response)", async () => {
    const ticket = { id: 1, subject: "Test Ticket" };

    api.get.mockResolvedValueOnce({
      data: { messages: [] },
    });

    api.post.mockRejectedValueOnce({
      response: {
        data: "Failed to send text",
      },
    });

    await act(async () => {
      render(
        <Chat
          ticket={ticket}
          onClose={() => {}}
          user={{ id: 1, username: "User" }}
        />
      );
    });

    await waitFor(() => {
      expect(api.get).toHaveBeenCalledWith("/api/tickets/1/messages/", {
        headers: { Authorization: "Bearer token" },
      });
    });

    const input = screen.getByPlaceholderText("Enter your message");
    const submitButton = screen.getByRole("button", { name: "Send" });

    await userEvent.type(input, "Hello");
    await userEvent.click(submitButton);

    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith(
        "/api/tickets/1/messages/post/",
        { message_body: "Hello",
          attachments: [] 
        },
        { headers: { Authorization: "Bearer token" } }
      );
    });

    expect(screen.getByText("Failed to send text")).toBeInTheDocument();
  });

  it("failed to fetch messages (with error.response)", async () => {
    const ticket = { id: 1, subject: "Test Ticket" };

    api.get.mockRejectedValueOnce({
      response: {
        data: "Failed to fetch messages",
      },
    });

    await act(async () => {
      render(
        <Chat
          ticket={ticket}
          onClose={() => {}}
          user={{ id: 1, username: "User" }}
        />
      );
    });

    await waitFor(() => {
      expect(api.get).toHaveBeenCalledWith("/api/tickets/1/messages/", {
        headers: { Authorization: "Bearer token" },
      });
    });

    expect(screen.getByText("Failed to fetch messages")).toBeInTheDocument();
  });

  it("failed to fetch messages (fallback)", async () => {
    const ticket = { id: 1, subject: "Test Ticket" };

    api.get.mockRejectedValueOnce(new Error("Network error!"));

    await act(async () => {
      render(
        <Chat
          ticket={ticket}
          onClose={() => {}}
          user={{ id: 1, username: "User" }}
        />
      );
    });

    await waitFor(() => {
      expect(api.get).toHaveBeenCalledWith("/api/tickets/1/messages/", {
        headers: { Authorization: "Bearer token" },
      });
    });

    expect(screen.getByText("Failed to fetch messages")).toBeInTheDocument();
  });


  it("failed to send a message (fallback)", async () => {
    const ticket = { id: 1, subject: "Test Ticket" };


    api.get.mockResolvedValueOnce({
      data: { messages: [] },
    });


    api.post.mockRejectedValueOnce(new Error("No server response"));

    await act(async () => {
      render(
        <Chat
          ticket={ticket}
          onClose={() => {}}
          user={{ id: 1, username: "User" }}
        />
      );
    });


    await waitFor(() => {
      expect(api.get).toHaveBeenCalledWith("/api/tickets/1/messages/", {
        headers: { Authorization: "Bearer token" },
      });
    });

    const input = screen.getByPlaceholderText("Enter your message");
    const submitButton = screen.getByRole("button", { name: "Send" });

    await userEvent.type(input, "Hello");
    await userEvent.click(submitButton);

    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith(
        "/api/tickets/1/messages/post/",
        { message_body: "Hello",
          attachments: []
        },
        { headers: { Authorization: "Bearer token" } }
      );
    });

    expect(screen.getByText("Failed to send text")).toBeInTheDocument();
  });


  it("renders messages from a different user in the other container", async () => {
    const ticket = { id: 1, subject: "Test Ticket" };
  
    api.get.mockResolvedValueOnce({
      data: {
        messages: [
          {
            message_id: 99,
            sender: "Alice",
            body: "Hello from Alice",
            created_at: new Date().toISOString(),
            sender_role: "role",
          },
        ],
      },
    });
  
    await act(async () => {
      render(
        <Chat
          ticket={ticket}
          onClose={() => {}}
          user={{ id: 1, username: "User" }} 
        />
      );
    });
  
    await waitFor(() => {
      expect(api.get).toHaveBeenCalledWith("/api/tickets/1/messages/", {
        headers: { Authorization: "Bearer token" },
      });
    });
  
    expect(screen.getByText("Hello from Alice")).toBeInTheDocument();
  });

  it("renders file attachment", async () => {
    const ticket = { id: 1, subject: "Test Ticket" };
    api.get.mockResolvedValueOnce({
      data: {
        messages: [
          {
            message_id: 1,
            sender: "User",
            body: "Hello",
            created_at: new Date().toISOString(),
            sender_role: "role",
            attachments: [
              {
                file_name: 'file1.txt',
                file_path: 'https://example.com/file1.txt',
              },
            ],
          },
        ],
      },
    });

    await act(async () => {
      render(
        <Chat
          ticket={ticket}
          onClose={() => {}}
          user={{ id: 1, username: "User" }}
        />
      );
    });

    await waitFor(() => {
      expect(api.get).toHaveBeenCalledWith("/api/tickets/1/messages/", {
        headers: { Authorization: "Bearer token" },
      });
    });

    expect(await screen.findByText('file1.txt')).toBeInTheDocument();

  });

  it("post message with attachment", async () => {
    const ticket = { id: 1, subject: "Test Ticket" };

    api.get.mockResolvedValueOnce({
      data: { messages: [] },
    });

    api.post.mockResolvedValueOnce({
      data: {
        message_id: 2,
        sender: "User",
        body: "Hello",
        created_at: new Date().toISOString(),
        sender_role: "role",
      },
    });

    api.get.mockResolvedValueOnce({
      data: {
        messages: [
          {
            message_id: 2,
            sender: "User",
            body: "Hello",
            created_at: new Date().toISOString(),
            sender_role: "role",
          },
        ],
      },
    });

    await act(async () => {
      render(
        <Chat
          ticket={ticket}
          onClose={() => {}}
          user={{ id: 1, username: "User" }}
        />
      );
    });

    await waitFor(() => {
      expect(api.get).toHaveBeenCalledWith("/api/tickets/1/messages/", {
        headers: { Authorization: "Bearer token" },
      });
    });

  const input = screen.getByPlaceholderText("Enter your message");
  const submitButton = screen.getByRole("button", { name: "Send" });

    
  const fileInput = screen.getByPlaceholderText("Optionally attach relevant files");
  const file = new File([], "sample.txt");
  
  await userEvent.upload(fileInput, file);
  await userEvent.type(input, "Hello");
  await userEvent.click(submitButton);

    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith(
        "/api/tickets/1/messages/post/",
        { message_body: "Hello",
          attachments: expect.arrayContaining([
            expect.objectContaining({
              file_name: "sample.txt",
              file_path: expect.any(String), 
            }),
          ]),
        },
        { headers: { Authorization: "Bearer token" } }
      );
    });

    expect(screen.getByText("Hello")).toBeInTheDocument();
  });
});