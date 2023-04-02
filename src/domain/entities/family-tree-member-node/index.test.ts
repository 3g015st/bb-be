import { EGenders } from "@root/domain/constants";
import {
  FamilyTreeMemberNode,
  FamilyTreeMemberNodeBuilder,
  IFamilyTreeMemberNodeBuilder,
} from ".";
import { DomainError, EDomainErrors } from "@root/domain/errors";

describe("FamilyTreeMemberNode - Unit Testing", () => {
  it("It must be able to create a new family tree member named John Doe", async () => {
    const familyTreeMemberNodeBuilder = new FamilyTreeMemberNodeBuilder();

    const johnDoeNode = familyTreeMemberNodeBuilder
      .setGender(EGenders.Male)
      .setName("John Doe")
      .build();

    expect(johnDoeNode.gender).toBe(EGenders.Male);
    expect(johnDoeNode.name).toBe("John Doe");
    expect(johnDoeNode.mother).toBe(undefined);
  });

  it("It must be able to create a family tree consisting of mother, father and three sons", async () => {
    const familyTreeMemberNodeBuilder = new FamilyTreeMemberNodeBuilder();

    const adamNode = familyTreeMemberNodeBuilder
      .setGender(EGenders.Male)
      .setName("Adam")
      .build();

    const eveNode = familyTreeMemberNodeBuilder
      .setGender(EGenders.Female)
      .setName("Eve")
      .build();

    adamNode.setPartner(eveNode);
    eveNode.setPartner(adamNode);

    const johnDoeNode = familyTreeMemberNodeBuilder
      .setGender(EGenders.Male)
      .setName("John Doe")
      .build();

    const joseRizalNode = familyTreeMemberNodeBuilder
      .setGender(EGenders.Male)
      .setName("Jose Rizal")
      .build();

    const andresBonifacioNode = familyTreeMemberNodeBuilder
      .setGender(EGenders.Male)
      .setName("Andres Bonifacio")
      .build();

    eveNode.addChild(johnDoeNode);
    eveNode.addChild(joseRizalNode);
    eveNode.addChild(andresBonifacioNode);

    expect(adamNode.partner).toBe(eveNode);
    expect(eveNode.partner).toBe(adamNode);

    expect(johnDoeNode.gender).toBe(EGenders.Male);
    expect(johnDoeNode.name).toBe("John Doe");
    expect(johnDoeNode.mother).toBe(eveNode);

    expect(joseRizalNode.gender).toBe(EGenders.Male);
    expect(joseRizalNode.name).toBe("Jose Rizal");
    expect(johnDoeNode.mother).toBe(eveNode);

    expect(andresBonifacioNode.gender).toBe(EGenders.Male);
    expect(andresBonifacioNode.name).toBe("Andres Bonifacio");
    expect(johnDoeNode.mother).toBe(eveNode);
  });

  it("It should throw an error because a child node cannot have a direct relationship with father node", async () => {
    const familyTreeMemberNodeBuilder = new FamilyTreeMemberNodeBuilder();

    try {
      familyTreeMemberNodeBuilder.setGender(EGenders.Male);
      familyTreeMemberNodeBuilder.setName("John Doe");

      const johnDoeNode = familyTreeMemberNodeBuilder.build();

      familyTreeMemberNodeBuilder.setGender(EGenders.Male);
      familyTreeMemberNodeBuilder.setName("Andres Bonifacio");

      familyTreeMemberNodeBuilder.build();
    } catch (error) {
      if (error instanceof DomainError) {
        expect(error).toBeInstanceOf(DomainError);
        expect(error.payload.message).toEqual(EDomainErrors.SET_ROOT_FAILED);
      }
    }
  });

  it("It should throw an error because a male node cannot have a direct relationship with child node", async () => {
    const familyTreeMemberNodeBuilder = new FamilyTreeMemberNodeBuilder();

    try {
      const johnDoeNode = familyTreeMemberNodeBuilder
        .setGender(EGenders.Male)
        .setName("John Doe")
        .build();

      const eveNode = familyTreeMemberNodeBuilder
        .setGender(EGenders.Female)
        .setName("Eve")
        .build();

      eveNode.setPartner(johnDoeNode);
      johnDoeNode.setPartner(eveNode);

      const andresNode = familyTreeMemberNodeBuilder
        .setGender(EGenders.Male)
        .setName("Andres Bonifacio")
        .build();

      johnDoeNode.addChild(andresNode);
    } catch (error) {
      if (error instanceof DomainError) {
        expect(error).toBeInstanceOf(DomainError);
        expect(error.payload.message).toEqual(
          EDomainErrors.CHILD_ADDITION_FAILED
        );
        expect(error.payload.failures[0]).toBe(EGenders.Male);
      }
    }
  });

  it("It should not be able to add an existing child with same name.", async () => {
    const familyTreeMemberNodeBuilder = new FamilyTreeMemberNodeBuilder();

    try {
      const johnDoeNode = familyTreeMemberNodeBuilder
        .setGender(EGenders.Male)
        .setName("John Doe")
        .build();

      const eveNode = familyTreeMemberNodeBuilder
        .setGender(EGenders.Female)
        .setName("Eve")
        .build();

      eveNode.setPartner(johnDoeNode);
      johnDoeNode.setPartner(eveNode);

      const andresNode = familyTreeMemberNodeBuilder
        .setGender(EGenders.Male)
        .setName("Andres Bonifacio")
        .build();

      const andresNodeTwo = familyTreeMemberNodeBuilder
        .setGender(EGenders.Male)
        .setName("Andres Bonifacio")
        .build();

      eveNode.addChild(andresNode);
      eveNode.addChild(andresNodeTwo);
    } catch (error) {
      if (error instanceof DomainError) {
        expect(error).toBeInstanceOf(DomainError);
        expect(error.payload.message).toEqual(
          EDomainErrors.CHILD_ADDITION_FAILED
        );
        expect(error.payload.failures[0]).toBe("Andres Bonifacio");
      }
    }
  });
});
