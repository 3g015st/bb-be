import { EGenders } from "@root/domain/constants";
import { FamilyTreeMemberNodeBuilder } from "@entities/family-tree-member-node";
import { FindChildrenStrategy } from ".";

describe("Find Children Strategy - Unit Testing", () => {
  it("It must be able to return the three sons of the family by father", async () => {
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

    const strategy = new FindChildrenStrategy(EGenders.Male);

    const result = strategy.execute({ node: adamNode });

    expect(result.length).toBe(3);
  });

  it("It must be able to return the one son and one daughter through father node", async () => {
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

    const mariaClaraNode = familyTreeMemberNodeBuilder
      .setGender(EGenders.Female)
      .setName("Maria Clara")
      .build();

    eveNode.addChild(johnDoeNode);
    eveNode.addChild(mariaClaraNode);

    const sonStrategy = new FindChildrenStrategy(EGenders.Male);
    const daughterStrategy = new FindChildrenStrategy(EGenders.Female);

    const sons = sonStrategy.execute({ node: adamNode });
    const daughter = daughterStrategy.execute({ node: adamNode });

    expect(sons.length).toBe(1);
    expect(daughter.length).toBe(1);
  });

  it("It must be able to return the three sons of the family by mother", async () => {
    const familyTreeMemberNodeBuilder = new FamilyTreeMemberNodeBuilder();

    familyTreeMemberNodeBuilder.setGender(EGenders.Male);
    familyTreeMemberNodeBuilder.setName("Adam");

    const adamNode = familyTreeMemberNodeBuilder.build();

    familyTreeMemberNodeBuilder.setGender(EGenders.Female);
    familyTreeMemberNodeBuilder.setName("Eve");

    const eveNode = familyTreeMemberNodeBuilder.build();

    adamNode.setPartner(eveNode);
    eveNode.setPartner(adamNode);

    familyTreeMemberNodeBuilder.setGender(EGenders.Male);
    familyTreeMemberNodeBuilder.setName("John Doe");

    const johnDoeNode = familyTreeMemberNodeBuilder.build();

    familyTreeMemberNodeBuilder.setGender(EGenders.Male);
    familyTreeMemberNodeBuilder.setName("Jose Rizal");

    const joseRizalNode = familyTreeMemberNodeBuilder.build();

    familyTreeMemberNodeBuilder.setGender(EGenders.Male);
    familyTreeMemberNodeBuilder.setName("Andres Bonifacio");

    const andresBonifacioNode = familyTreeMemberNodeBuilder.build();

    familyTreeMemberNodeBuilder.setGender(EGenders.Female);
    familyTreeMemberNodeBuilder.setName("Maria Clara");

    const mariaClaraNode = familyTreeMemberNodeBuilder.build();

    eveNode.addChild(johnDoeNode);
    eveNode.addChild(joseRizalNode);
    eveNode.addChild(andresBonifacioNode);
    eveNode.addChild(mariaClaraNode);

    const strategy = new FindChildrenStrategy(EGenders.Male);

    const result = strategy.execute({ node: eveNode });

    expect(result.length).toBe(3);
  });

  it("It must be able to return the 0 sons since Adam and Eve has no children", async () => {
    const familyTreeMemberNodeBuilder = new FamilyTreeMemberNodeBuilder();

    familyTreeMemberNodeBuilder.setGender(EGenders.Male);
    familyTreeMemberNodeBuilder.setName("Adam");

    const adamNode = familyTreeMemberNodeBuilder.build();

    familyTreeMemberNodeBuilder.setGender(EGenders.Female);
    familyTreeMemberNodeBuilder.setName("Eve");

    const eveNode = familyTreeMemberNodeBuilder.build();

    adamNode.setPartner(eveNode);
    eveNode.setPartner(adamNode);

    const strategy = new FindChildrenStrategy(EGenders.Male);

    const result = strategy.execute({ node: eveNode });

    expect(result.length).toBe(0);
  });
});
