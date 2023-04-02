import { IFamilyTreeMemberNode } from "@domain/entities/family-tree-member-node";
import {
  IFamilyTreeGetRelationshipStrategy,
  IFamilyTreeGetRelationshipStrategyParams,
} from "../index";
import { DomainError, EDomainErrors } from "@domain/errors";

export class FindSiblingsStrategy
  implements IFamilyTreeGetRelationshipStrategy
{
  constructor() {}

  execute(
    params: IFamilyTreeGetRelationshipStrategyParams
  ): IFamilyTreeMemberNode[] | null[] {
    const { node } = params;

    const motherNode = node.mother;

    if (!motherNode) {
      throw new DomainError({
        message: EDomainErrors.PERSON_NOT_FOUND,
        failures: ["Mother"],
      });
    }

    const children = Array.from(motherNode.children.values());
    const siblingsNodes = children.filter((child) => child.name !== node.name);
    return siblingsNodes;
  }
}
