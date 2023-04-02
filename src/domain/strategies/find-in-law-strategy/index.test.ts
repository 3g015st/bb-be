import { EFamilyTreeRelationships, EGenders } from "@root/domain/constants";
import { FamilyTreeMemberNodeBuilder } from "@entities/family-tree-member-node";
import { FindInLawStrategy } from ".";

describe("Find In Laws Strategy - Unit Testing", () => {
  it("It must be able to return the sisters in law of John Doe through spouse which are Lisa, and Layla", async () => {
    const familyTreeMemberNodeBuilder = new FamilyTreeMemberNodeBuilder();

    // Adam - Eve Family
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

    // Arthur - Margaret Family
    const arthurNode = familyTreeMemberNodeBuilder
      .setGender(EGenders.Male)
      .setName("Arthur")
      .build();

    const margaretNode = familyTreeMemberNodeBuilder
      .setGender(EGenders.Female)
      .setName("Eve")
      .build();

    arthurNode.setPartner(margaretNode);
    margaretNode.setPartner(arthurNode);

    const lilyNode = familyTreeMemberNodeBuilder
      .setGender(EGenders.Female)
      .setName("Lily")
      .build();

    const lisaNode = familyTreeMemberNodeBuilder
      .setGender(EGenders.Female)
      .setName("Lisa")
      .build();

    const laylaNode = familyTreeMemberNodeBuilder
      .setGender(EGenders.Female)
      .setName("Layla")
      .build();

    const mikeNode = familyTreeMemberNodeBuilder
      .setGender(EGenders.Male)
      .setName("Mike")
      .build();

    margaretNode.addChild(lilyNode);
    margaretNode.addChild(lisaNode);
    margaretNode.addChild(laylaNode);
    margaretNode.addChild(mikeNode);

    johnDoeNode.setPartner(lilyNode);
    lilyNode.setPartner(johnDoeNode);

    const strategy = new FindInLawStrategy(
      EFamilyTreeRelationships.SISTER_IN_LAW
    );

    const inLaws = strategy.execute({ node: johnDoeNode });

    expect(inLaws.length).toBe(2);
    expect(inLaws[0]?.name).toBe("Lisa");
    expect(inLaws[1]?.name).toBe("Layla");
  });

  it("It must be able to return the sisters in law of John Doe through siblings which are Mary, and Mika", async () => {
    const familyTreeMemberNodeBuilder = new FamilyTreeMemberNodeBuilder();

    // Adam - Eve Family
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

    // Arthur - Margaret Family
    const arthurNode = familyTreeMemberNodeBuilder
      .setGender(EGenders.Male)
      .setName("Arthur")
      .build();

    const margaretNode = familyTreeMemberNodeBuilder
      .setGender(EGenders.Female)
      .setName("Eve")
      .build();

    arthurNode.setPartner(margaretNode);
    margaretNode.setPartner(arthurNode);

    const maryNode = familyTreeMemberNodeBuilder
      .setGender(EGenders.Female)
      .setName("Mary")
      .build();

    const mikaNode = familyTreeMemberNodeBuilder
      .setGender(EGenders.Female)
      .setName("Mika")
      .build();

    const lesterNode = familyTreeMemberNodeBuilder
      .setGender(EGenders.Male)
      .setName("Lester")
      .build();

    margaretNode.addChild(maryNode);
    margaretNode.addChild(mikaNode);
    margaretNode.addChild(lesterNode);

    andresBonifacioNode.setPartner(mikaNode);
    mikaNode.setPartner(andresBonifacioNode);

    joseRizalNode.setPartner(maryNode);
    maryNode.setPartner(joseRizalNode);

    const strategy = new FindInLawStrategy(
      EFamilyTreeRelationships.SISTER_IN_LAW
    );

    const inLaws = strategy.execute({ node: johnDoeNode });

    expect(inLaws.length).toBe(2);
    expect(inLaws[0]?.name).toBe("Mary");
    expect(inLaws[1]?.name).toBe("Mika");
  });

  it("It must be able to return the sisters in law of John Doe through spouse & siblings which are Mary, Mika, and Jillian", async () => {
    const familyTreeMemberNodeBuilder = new FamilyTreeMemberNodeBuilder();

    // Adam - Eve Family
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

    // Arthur - Margaret Family
    const arthurNode = familyTreeMemberNodeBuilder
      .setGender(EGenders.Male)
      .setName("Arthur")
      .build();

    const margaretNode = familyTreeMemberNodeBuilder
      .setGender(EGenders.Female)
      .setName("Eve")
      .build();

    arthurNode.setPartner(margaretNode);
    margaretNode.setPartner(arthurNode);

    const maryNode = familyTreeMemberNodeBuilder
      .setGender(EGenders.Female)
      .setName("Mary")
      .build();

    const mikaNode = familyTreeMemberNodeBuilder
      .setGender(EGenders.Female)
      .setName("Mika")
      .build();

    const lesterNode = familyTreeMemberNodeBuilder
      .setGender(EGenders.Male)
      .setName("Lester")
      .build();

    margaretNode.addChild(maryNode);
    margaretNode.addChild(mikaNode);
    margaretNode.addChild(lesterNode);

    // James - Jennie Family
    const jamesNode = familyTreeMemberNodeBuilder
      .setGender(EGenders.Male)
      .setName("James")
      .build();

    const jennieNode = familyTreeMemberNodeBuilder
      .setGender(EGenders.Female)
      .setName("Jennie")
      .build();

    jamesNode.setPartner(jennieNode);
    jennieNode.setPartner(jamesNode);

    const janeNode = familyTreeMemberNodeBuilder
      .setGender(EGenders.Female)
      .setName("Jane")
      .build();

    const jillianNode = familyTreeMemberNodeBuilder
      .setGender(EGenders.Female)
      .setName("Jillian")
      .build();

    jennieNode.addChild(janeNode);
    jennieNode.addChild(jillianNode);

    andresBonifacioNode.setPartner(mikaNode);
    mikaNode.setPartner(andresBonifacioNode);

    joseRizalNode.setPartner(maryNode);
    maryNode.setPartner(joseRizalNode);

    johnDoeNode.setPartner(janeNode);
    janeNode.setPartner(johnDoeNode);

    const strategy = new FindInLawStrategy(
      EFamilyTreeRelationships.SISTER_IN_LAW
    );

    const inLaws = strategy.execute({ node: johnDoeNode });

    expect(inLaws.length).toBe(3);
    expect(inLaws[0]?.name).toBe("Jillian");
    expect(inLaws[1]?.name).toBe("Mary");
    expect(inLaws[2]?.name).toBe("Mika");
  });
});
