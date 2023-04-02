import { EGenders } from "@root/domain/constants";
import { FamilyTree } from ".";
import { DomainError, EDomainErrors } from "@root/domain/errors";
import { FamilyTreeMemberNodeBuilder } from "../family-tree-member-node";

describe("FamilyTree - Unit Testing", () => {
  it("It must be able to get the sons of Alice Doe (mother)", async () => {
    const familyTreeMemberNodeBuilder = new FamilyTreeMemberNodeBuilder();
    const familyTree = new FamilyTree(familyTreeMemberNodeBuilder);

    familyTree.setRoot({
      familyHeadGender: EGenders.Male,
      familyHeadName: "John Doe",
    });

    const marriedCouple = familyTree.setPartner({
      partnerName: "John Doe",
      newFamilyMemberGender: EGenders.Female,
      newFamilyMemberName: "Alice Doe",
    });

    const columbusDoe = familyTree.addChild({
      childName: "Colombus Doe",
      motherName: "Alice Doe",
      childGender: EGenders.Male,
    });

    const relationships = familyTree.getRelationship({ name: "Alice Doe" });

    expect(relationships.length).toBe(1);
    expect(relationships[0]?.name).toBe("Colombus Doe");
  });

  it("It must throw an error because the founding father or the root of the family cannot be replaced.", async () => {
    const familyTreeMemberNodeBuilder = new FamilyTreeMemberNodeBuilder();
    const familyTree = new FamilyTree(familyTreeMemberNodeBuilder);

    try {
      familyTree.setRoot({
        familyHeadGender: EGenders.Male,
        familyHeadName: "John Doe",
      });

      familyTree.setRoot({
        familyHeadGender: EGenders.Male,
        familyHeadName: "John Daw",
      });
    } catch (error) {
      if (error instanceof DomainError) {
        expect(error).toBeInstanceOf(DomainError);
        expect(error.payload.message).toEqual(EDomainErrors.SET_ROOT_FAILED);
        expect(error.payload.failures[0]).toBe("John Doe");
      }
    }
  });

  it("It should not be able to set partner since Beast does not exist at the family tree", async () => {
    const familyTreeMemberNodeBuilder = new FamilyTreeMemberNodeBuilder();
    const familyTree = new FamilyTree(familyTreeMemberNodeBuilder);

    try {
      familyTree.setPartner({
        partnerName: "Beast",
        newFamilyMemberGender: EGenders.Female,
        newFamilyMemberName: "Beauty",
      });
    } catch (error) {
      if (error instanceof DomainError) {
        expect(error).toBeInstanceOf(DomainError);
        expect(error.payload.message).toEqual(EDomainErrors.PERSON_NOT_FOUND);
        expect(error.payload.failures[0]).toBe("Beast");
      }
    }
  });

  it("It must throw an error because Bachira Megumi does not exist at family tree", async () => {
    const familyTreeMemberNodeBuilder = new FamilyTreeMemberNodeBuilder();
    const familyTree = new FamilyTree(familyTreeMemberNodeBuilder);

    try {
      const relationships = familyTree.getRelationship({
        name: "Bachira Megumi",
      });
    } catch (error) {
      if (error instanceof DomainError) {
        expect(error).toBeInstanceOf(DomainError);
        expect(error.payload.message).toEqual(EDomainErrors.PERSON_NOT_FOUND);
        expect(error.payload.failures[0]).toBe("Bachira Megumi");
      }
    }
  });
});
