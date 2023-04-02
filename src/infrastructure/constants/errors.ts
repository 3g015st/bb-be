export enum EInfrastructureErrors {
  FILE_NOT_FOUND = "File does not exists",
  FILE_IS_INVALID = "File is invalid",
  STRING_VALIDATION_FAILED = "String validation failed",
  STRING_TRANSFORM_FAILED = "String transform failed",
}

export interface IInfrastructureErrorParams {
  message: string;
  failures: Array<string | number | InfrastructureError>;
}

export class InfrastructureError extends Error {
  public payload: IInfrastructureErrorParams;

  constructor(params: IInfrastructureErrorParams) {
    const defaultMsg = "Infrastructure error";
    super(defaultMsg);
    this.payload = params;
  }
}
