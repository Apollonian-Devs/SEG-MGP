import { describe, it, expect, vi } from "vitest";
import { handleToastPromise } from "../../utils/toastUtils";
import { toast } from 'sonner';

vi.mock("sonner", () => ({
    toast: {
      promise: vi.fn((promise, handlers) =>
        promise
          .then(() => {
            return handlers.success();  // RETURN the success message!
          })
          .catch(handlers.error)
      ),
    },
  }));
  

describe("toastUtils", () => {
  it("shows an error message if errorCallback is not provided", async () => {
    const errorMessage = "An error occurred";
    const error = new Error(errorMessage);

    const promise = Promise.reject(error);

    await expect(
      handleToastPromise(promise, {
        loading: "Loading...",
        successMessage: "Operation successful",
      })
    ).resolves.toBe(errorMessage); // Because toast.promise returns error handler result
  });

  it ("shows an error message if errorCallback is provided", async () => {
    const errorMessage = "An error occurred";
    const error = new Error(errorMessage);

    const promise = Promise.reject(error);

    await expect(
      handleToastPromise(promise, {
        loading: "Loading...",
        successMessage: "Operation successful",
        errorCallback: (error) => `Error: ${error.message}`,
      })
    ).resolves.toBe(`Error: ${errorMessage}`);
  });

  it ("shows a success message if successCallback is provided", async () => {
    const successMessage = "Operation successful";

    const promise = Promise.resolve();

    await expect(
        handleToastPromise(promise, {
          loading: "Loading...",
          successMessage,
          successCallback: async () => {},
        })
      ).resolves.toBe(successMessage);
    });      

});
