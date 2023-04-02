export enum EFamilyTreeCommands {
  ADD_CHILD = "ADD_CHILD",
  GET_RELATIONSHIP = "GET_RELATIONSHIP",
  SET_PARTNER = "SET_PARTNER",
  SET_FAMILY_HEAD = "SET_FAMILY_HEAD",
}

export enum EFamilyTreeRelationships {
  PATERNAL_UNCLE = "Paternal-Uncle",
  MATERNAL_UNCLE = "Maternal-Uncle",
  PATERNAL_AUNT = "Paternal-Aunt",
  MATERNAL_AUNT = "Maternal-Aunt",
  SISTER_IN_LAW = "Sister-In-Law",
  BROTHER_IN_LAW = "Brother-In-Law",
  SON = "Son",
  DAUGHTER = "Daughter",
  SIBLINGS = "Siblings",
}

export enum EGenders {
  Male = "Male",
  Female = "Female",
}

export enum ESuccessfulResponses {
  CHILD_ADDED = "CHILD_ADDED",
  PARTNER_SET = "PARTNER_SET",
  FAMILY_HEAD_SET = "FAMILY_HEAD_SET",
  NO_RELATIONSHIPS = "NONE",
}
