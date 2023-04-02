import { EGenders } from "@root/domain/constants";
import { DomainError, EDomainErrors } from "@root/domain/errors";

export interface IFamilyTreeMemberNode {
  children: Map<string, FamilyTreeMemberNode>;
  mother?: IFamilyTreeMemberNode;
  partner?: IFamilyTreeMemberNode;
  gender: EGenders;
  name: string;
  setPartner(partner: IFamilyTreeMemberNode): IFamilyTreeMemberNode;
  addChild(child: IFamilyTreeMemberNode): IFamilyTreeMemberNode;
}

export interface IFamilyTreeMemberNodeBuilder {
  setName(name: string): this;
  setGender(gender: EGenders): this;
  build(): IFamilyTreeMemberNode;
}

export class FamilyTreeMemberNode implements IFamilyTreeMemberNode {
  children = new Map<string, FamilyTreeMemberNode>();
  mother?: FamilyTreeMemberNode;
  partner?: FamilyTreeMemberNode;
  gender: EGenders;
  name: string;
  setPartner(partner: FamilyTreeMemberNode) {
    this.partner = partner;
    return this;
  }
  addChild(child: FamilyTreeMemberNode) {
    if (this.gender == EGenders.Male) {
      throw new DomainError({
        message: EDomainErrors.CHILD_ADDITION_FAILED,
        failures: [EGenders.Male],
      });
    } else if (this.children.get(child.name)) {
      throw new DomainError({
        message: EDomainErrors.CHILD_ADDITION_FAILED,
        failures: [child.name],
      });
    }

    this.children.set(child.name, child);
    child.mother = this;
    return this;
  }
}

export class FamilyTreeMemberNodeBuilder
  implements IFamilyTreeMemberNodeBuilder
{
  private familyTreeMemberNode: FamilyTreeMemberNode;

  constructor() {
    this.familyTreeMemberNode = new FamilyTreeMemberNode();
  }

  setName(name: string) {
    this.familyTreeMemberNode.name = name;
    return this;
  }
  setGender(gender: EGenders) {
    this.familyTreeMemberNode.gender = gender;
    return this;
  }

  #reset() {
    this.familyTreeMemberNode = new FamilyTreeMemberNode();
  }

  build(): FamilyTreeMemberNode {
    const node = this.familyTreeMemberNode;
    this.#reset();
    return node;
  }
}
