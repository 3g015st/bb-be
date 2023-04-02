import { EFamilyTreeRelationships, EGenders } from "../constants";

export type TAddChildArgs = [string, string, EGenders];
export type TSetPartnerArgs = [string, string, EGenders];
export type TGetRelationshipArgs = [string, EFamilyTreeRelationships];
export type TSetFamilyHeadArgs = [string, EGenders];
export type UArgs =
  | TAddChildArgs
  | TSetFamilyHeadArgs
  | TGetRelationshipArgs
  | TSetFamilyHeadArgs;
