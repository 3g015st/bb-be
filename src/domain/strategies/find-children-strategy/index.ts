import { IFamilyTreeMemberNode } from "@domain/entities/family-tree-member-node";
import {
  IFamilyTreeGetRelationshipStrategy,
  IFamilyTreeGetRelationshipStrategyParams,
} from "../index";
import { EGenders } from "@domain/constants";
import { DomainError, EDomainErrors } from "@domain/errors";

export class FindChildrenStrategy
  implements IFamilyTreeGetRelationshipStrategy
{
  private childrenGender: EGenders;

  constructor(childrenGender: EGenders) {
    this.childrenGender = childrenGender;
  }

  execute(
    params: IFamilyTreeGetRelationshipStrategyParams
  ): IFamilyTreeMemberNode[] | null[] {
    const { node } = params;

    switch (node.gender) {
      case EGenders.Female: {
        return this.#findChildrenFromMother(this.childrenGender, node);
      }
      case EGenders.Male: {
        const wifeNode = node.partner;

        if (!wifeNode) {
          throw new DomainError({
            message: EDomainErrors.PERSON_NOT_FOUND,
            failures: ["Mother"],
          });
        }

        return this.#findChildrenFromMother(this.childrenGender, wifeNode);
      }
      default: {
        return this.#findChildrenFromMother(this.childrenGender, node);
      }
    }
  }

  #findChildrenFromMother(
    gender: EGenders,
    motherNode: IFamilyTreeMemberNode
  ): Array<IFamilyTreeMemberNode> | Array<null> {
    if (motherNode.children.size == 0) return [];

    const children = Array.from(motherNode.children.values());
    const childrenNodes = children.filter((child) => child.gender === gender);
    return childrenNodes;
  }
}
