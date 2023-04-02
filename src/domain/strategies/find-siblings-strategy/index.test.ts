import { EGenders } from "@root/domain/constants";
import { FamilyTreeMemberNodeBuilder } from "@entities/family-tree-member-node";
import { FindSiblingsStrategy } from ".";

describe("Find Siblings Strategy - Unit Testing", () => {
  it("It must be able to return the the siblings of John Doe which are Jose Rizal and Andres Bonifacio", async () => {
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

    const strategy = new FindSiblingsStrategy();

    const result = strategy.execute({ node: johnDoeNode });

    expect(result.length).toBe(2);
    expect(result[0]?.name).toBe("Jose Rizal");
    expect(result[1]?.name).toBe("Andres Bonifacio");
  });

  it("It must be able to return 0 siblings because child John Doe does not have any siblings.", async () => {
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

    eveNode.addChild(johnDoeNode);

    const strategy = new FindSiblingsStrategy();

    const result = strategy.execute({ node: johnDoeNode });

    expect(result.length).toBe(0);
  });
});
