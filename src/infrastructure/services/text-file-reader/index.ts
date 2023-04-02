import {
  IFileReader,
  IFileReaderParams,
  IFileReaderResponse,
} from "@infrastructure/interfaces/file-reader";
import {
  EInfrastructureErrors,
  InfrastructureError,
} from "@infrastructure/constants/errors";

import * as fs from "fs";
import { isText } from "istextorbinary";

export class TextFileReader
  implements IFileReader<IFileReaderResponse<string>>
{
  constructor() {}

  read(params: IFileReaderParams) {
    const { location } = params;

    try {
      if (this.#validateExistence(params) && this.#validateFileType(params)) {
        let data = fs.readFileSync(location, "utf8");

        return { data: data.toString() };
      }

      return { data: "" };
    } catch (e) {
      throw e;
    }
  }

  #validateExistence(params: IFileReaderParams) {
    const { location } = params;

    if (location == "") {
      throw new InfrastructureError({
        message: EInfrastructureErrors.FILE_NOT_FOUND,
        failures: [],
      });
    }

    const result = fs.existsSync(location);

    if (result) {
      return true;
    }

    throw new InfrastructureError({
      message: EInfrastructureErrors.FILE_NOT_FOUND,
      failures: [],
    });
  }

  #validateFileType(params: IFileReaderParams) {
    const { location } = params;
    const result = isText(location);

    if (result) {
      return true;
    }

    throw new InfrastructureError({
      message: EInfrastructureErrors.FILE_IS_INVALID,
      failures: [],
    });
  }
}
