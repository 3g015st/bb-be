export enum EDomainErrors {
  CHILD_ADDITION_FAILED = "CHILD_ADDITION_FAILED",
  SET_MOTHER_FAILED = "SET_MOTHER_FAILED",
  SET_ROOT_FAILED = "SET_ROOT_FAILED",
  PERSON_NOT_FOUND = "PERSON_NOT_FOUND",
  COMMAND_NOT_FOUND = "COMMAND_NOT_FOUND",
  RELATIONSHIP_TYPE_NOT_FOUND = "RELATIONSHIP_TYPE_NOT_FOUND",
  GENDER_NOT_FOUND = "GENDER_NOT_FOUND"
}

export interface IDomainErrorParams {
  message: string;
  failures: Array<string | number | DomainError>;
}

export class DomainError extends Error {
  public payload: IDomainErrorParams;

  constructor(params: IDomainErrorParams) {
    const defaultMsg = "Domain error";
    super(defaultMsg);
    this.payload = params;
  }
}
