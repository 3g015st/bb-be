import {
  EInfrastructureErrors,
  InfrastructureError,
} from "@root/infrastructure/constants/errors";
import { ExtractCommandStringTransformer } from ".";

describe("ExtractCommandTransformer - Unit Testing", () => {
  it("It will successfully transform a string", async () => {
    const extractCommand = new ExtractCommandStringTransformer();

    try {
      const { result } = extractCommand.transform({
        data: "ADD_CHILD Flora Minerva Female\nGET_RELATIONSHIP Remus Maternal-Aunt",
      });

      expect(result.length).toBe(2);
      expect(result[1].args.length).toBe(2);
      expect(result[0].args.length).toBe(3);
      expect(result[0].command).toBe("ADD_CHILD");
      expect(result[1].command).toBe("GET_RELATIONSHIP");
    } catch (error) {}
  });

  it("It will fail to transform a string because ADD_CHILD args exceeds", async () => {
    const extractCommand = new ExtractCommandStringTransformer();

    try {
      const { result } = extractCommand.transform({
        data: "ADD_CHILD Flora Minerva Female Exceed\nGET_RELATIONSHIP Remus Maternal-Aunt",
      });
    } catch (error) {
      if (error instanceof InfrastructureError) {
        expect(error).toBeInstanceOf(InfrastructureError);
        expect(error.payload.message).toEqual(
          EInfrastructureErrors.STRING_VALIDATION_FAILED
        );
        expect(error.payload.failures.length).toEqual(3);
        expect(error.payload.failures[0]).toEqual("ADD_CHILD");
      }
    }
  });

  it("It will fail to transform a string because ADD_CHILD args lacks parameters", async () => {
    const extractCommand = new ExtractCommandStringTransformer();

    try {
      const { result } = extractCommand.transform({
        data: "ADD_CHILD Flora Minerva Female\nGET_RELATIONSHIP Remus",
      });
    } catch (error) {
      if (error instanceof InfrastructureError) {
        expect(error).toBeInstanceOf(InfrastructureError);
        expect(error.payload.message).toEqual(
          EInfrastructureErrors.STRING_VALIDATION_FAILED
        );
        expect(error.payload.failures.length).toEqual(3);
        expect(error.payload.failures[0]).toEqual("GET_RELATIONSHIP");
      }
    }
  });

  it("It will fail to process because command is invalid", async () => {
    const extractCommand = new ExtractCommandStringTransformer();

    try {
      const { result } = extractCommand.transform({
        data: "INVALID_COMMAND Flora Minerva Female\nGET_RELATIONSHIP Remus",
      });
    } catch (error) {
      if (error instanceof InfrastructureError) {
        expect(error).toBeInstanceOf(InfrastructureError);
        expect(error.payload.message).toEqual(
          EInfrastructureErrors.STRING_VALIDATION_FAILED
        );
        expect(error.payload.failures.length).toEqual(1);
        expect(error.payload.failures[0]).toEqual("INVALID_COMMAND");
      }
    }
  });

  it("It will fail to process because string is empty", async () => {
    const extractCommand = new ExtractCommandStringTransformer();

    try {
      const { result } = extractCommand.transform({
        data: "",
      });
    } catch (error) {
      if (error instanceof InfrastructureError) {
        expect(error).toBeInstanceOf(InfrastructureError);
        expect(error.payload.message).toEqual(
          EInfrastructureErrors.STRING_VALIDATION_FAILED
        );
        expect(error.payload.failures.length).toEqual(1);
        expect(error.payload.failures[0]).toEqual("");
      }
    }
  });
});
