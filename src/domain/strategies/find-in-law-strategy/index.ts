import { IFamilyTreeMemberNode } from "@domain/entities/family-tree-member-node";
import {
  IFamilyTreeGetRelationshipStrategy,
  IFamilyTreeGetRelationshipStrategyParams,
} from "../index";
import { EFamilyTreeRelationships, EGenders } from "@domain/constants";

export class FindInLawStrategy implements IFamilyTreeGetRelationshipStrategy {
  private relationship: EFamilyTreeRelationships;

  constructor(relationship: EFamilyTreeRelationships) {
    this.relationship = relationship;
  }

  execute(
    params: IFamilyTreeGetRelationshipStrategyParams
  ): IFamilyTreeMemberNode[] | null[] {
    const { node } = params;

    const gender =
      this.relationship === EFamilyTreeRelationships.BROTHER_IN_LAW
        ? EGenders.Male
        : EGenders.Female;

    const throughSpouse = this.#findThroughSpouse(node, gender);
    const throughSiblings = this.#findThroughSiblings(node, gender);

    return [...throughSpouse, ...throughSiblings];
  }

  #findThroughSpouse(node: IFamilyTreeMemberNode, gender: EGenders) {
    const partnerNode = node.partner;
    const motherInLawNode = partnerNode?.mother;

    if (!partnerNode || !motherInLawNode) {
      return [];
    }

    const motherInLawChildren = motherInLawNode.children;

    const children = Array.from(motherInLawChildren.values());
    const inLaws = children.filter(
      (child) => child.name !== partnerNode.name && child.gender == gender
    );

    return inLaws;
  }

  #findThroughSiblings(node: IFamilyTreeMemberNode, gender: EGenders) {
    const motherNode = node.mother;

    if (!motherNode) {
      return [];
    }

    const children = Array.from(motherNode.children.values());

    const siblingsNodes = children.filter(
      (child) => child.name !== node.name && child.gender !== gender
    );

    let inLaws = [];

    for (const siblingNode of siblingsNodes) {
      if (siblingNode.partner) {
        inLaws.push(siblingNode.partner);
      }
    }

    return inLaws;
  }
}
