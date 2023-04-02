import {
  EInfrastructureErrors,
  InfrastructureError,
} from "@root/infrastructure/constants/errors";
import { TextFileReader } from ".";
import * as fs from "fs";

describe("TextFileReader - Unit Testing", () => {
  const tempFileLocationOne = "./test.txt";
  const tempFileLocationTwo = "./test.pdf";
  beforeAll(async () => {
    // TODO: Might refactor later for cleaner code, but for now not a priority since this is just for testing purposes.
    // File creation.
    const contents = [
      "ADD_CHILD Flora Minerva Female",
      "GET_RELATIONSHIP Remus Maternal-Aunt",
    ];

    fs.writeFileSync(tempFileLocationOne, contents.join("\n"));
    fs.writeFileSync(tempFileLocationTwo, contents.join("\n"));
  });

  afterAll(async () => {
    // File removal
    fs.rmSync(tempFileLocationOne);
    fs.rmSync(tempFileLocationTwo);
  });

  it("It will successfully read a file and output a string type", async () => {
    const textFileReader = new TextFileReader();

    try {
      const params = { location: tempFileLocationOne };
      const result = textFileReader.read(params);

      expect(typeof result).toBe("string");
      expect(result).toBe(
        "ADD_CHILD Flora Minerva Female\nGET_RELATIONSHIP Remus Maternal-Aunt"
      );
    } catch (error) {}
  });

  it("It will throw an error because file does not exists", async () => {
    const textFileReader = new TextFileReader();

    try {
      const params = { location: "./sample.txt" };
      const result = textFileReader.read(params);
    } catch (error) {
      if (error instanceof InfrastructureError) {
        expect(error).toBeInstanceOf(InfrastructureError);
        expect(error.payload.message).toEqual(
          EInfrastructureErrors.FILE_NOT_FOUND
        );
      }
    }
  });

  it("It will throw an error because file location passed is an empty string", async () => {
    const textFileReader = new TextFileReader();

    try {
      const params = { location: "" };
      const result = textFileReader.read(params);
    } catch (error) {
      if (error instanceof InfrastructureError) {
        expect(error).toBeInstanceOf(InfrastructureError);
        expect(error.payload.message).toEqual(
          EInfrastructureErrors.FILE_NOT_FOUND
        );
      }
    }
  });

  it("It will throw an error because file type is not a text file", async () => {
    const textFileReader = new TextFileReader();

    try {
      const params = { location: tempFileLocationTwo };
      const result = textFileReader.read(params);
    } catch (error) {
      if (error instanceof InfrastructureError) {
        expect(error).toBeInstanceOf(InfrastructureError);
        expect(error.payload.message).toEqual(
          EInfrastructureErrors.FILE_IS_INVALID
        );
      }
    }
  });
});
