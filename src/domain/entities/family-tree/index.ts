import { IFamilyTreeGetRelationshipStrategy } from "@root/domain/strategies";
import {
  FamilyTreeMemberNode,
  IFamilyTreeMemberNode,
  IFamilyTreeMemberNodeBuilder,
} from "../family-tree-member-node";
import { DomainError, EDomainErrors } from "@root/domain/errors";

import { EGenders } from "@root/domain/constants";
import { FindChildrenStrategy } from "@root/domain/strategies/find-children-strategy";

export type TMarriedPartners = [IFamilyTreeMemberNode, IFamilyTreeMemberNode];

export interface IFamilyTreeAddChildParams {
  childName: string;
  motherName: string;
  childGender: EGenders;
}

export interface IFamilyTreeGetRelationshipParams {
  name: string;
}

export interface IFamilyTreeSetPartnerParams {
  newFamilyMemberName: string;
  partnerName: string;
  newFamilyMemberGender: EGenders;
}

export interface IFamilyTreeSetRootParams {
  familyHeadName: string;
  familyHeadGender: EGenders;
}

export interface IFamilyTree {
  setRoot(params: IFamilyTreeSetRootParams): IFamilyTreeMemberNode;
  setGetRelationshipStrategy(
    strategy: IFamilyTreeGetRelationshipStrategy
  ): void;
  setPartner(params: IFamilyTreeSetPartnerParams): TMarriedPartners;
  getRelationship(
    params: IFamilyTreeGetRelationshipParams
  ): Array<IFamilyTreeMemberNode> | Array<null>;
  addChild(params: IFamilyTreeAddChildParams): IFamilyTreeMemberNode;
}

export class FamilyTree implements IFamilyTree {
  private root: IFamilyTreeMemberNode;
  private familyTreeMembersHashMap: Map<string, IFamilyTreeMemberNode>;
  private familyTreeFindRelationshipStrategy: IFamilyTreeGetRelationshipStrategy;
  private familyTreeMemberNodeBuilder: IFamilyTreeMemberNodeBuilder;

  constructor(familyTreeMemberNodeBuilder: IFamilyTreeMemberNodeBuilder) {
    this.familyTreeMembersHashMap = new Map();
    this.familyTreeMemberNodeBuilder = familyTreeMemberNodeBuilder;

    // Default strategy
    this.familyTreeFindRelationshipStrategy = new FindChildrenStrategy(
      EGenders.Male
    );
  }

  setPartner(params: IFamilyTreeSetPartnerParams) {
    const { partnerName, newFamilyMemberName, newFamilyMemberGender } = params;

    const familyMemberToBePartneredNode =
      this.familyTreeMembersHashMap.get(partnerName);

    if (!familyMemberToBePartneredNode) {
      throw new DomainError({
        message: EDomainErrors.PERSON_NOT_FOUND,
        failures: [partnerName],
      });
    }

    const newFamilyMember = this.familyTreeMemberNodeBuilder
      .setGender(newFamilyMemberGender)
      .setName(newFamilyMemberName)
      .build();

    familyMemberToBePartneredNode.setPartner(newFamilyMember);
    newFamilyMember.setPartner(familyMemberToBePartneredNode);

    this.familyTreeMembersHashMap.set(newFamilyMember.name, newFamilyMember);

    const married: TMarriedPartners = [
      familyMemberToBePartneredNode,
      newFamilyMember,
    ];
    return married;
  }

  setRoot(params: IFamilyTreeSetRootParams): IFamilyTreeMemberNode {
    const { familyHeadGender, familyHeadName } = params;
    const familyHeadNode = this.familyTreeMemberNodeBuilder
      .setGender(familyHeadGender)
      .setName(familyHeadName)
      .build();

    if (!this.root) {
      this.root = familyHeadNode;
      this.familyTreeMembersHashMap.set(familyHeadName, familyHeadNode);
      return familyHeadNode;
    }

    throw new DomainError({
      message: EDomainErrors.SET_ROOT_FAILED,
      failures: [this.root.name],
    });
  }

  setGetRelationshipStrategy(strategy: IFamilyTreeGetRelationshipStrategy) {
    this.familyTreeFindRelationshipStrategy = strategy;
  }

  getRelationship(params: IFamilyTreeGetRelationshipParams) {
    const { name } = params;

    const node = this.familyTreeMembersHashMap.get(name);

    if (!node) {
      throw new DomainError({
        message: EDomainErrors.PERSON_NOT_FOUND,
        failures: [name],
      });
    }

    const familyTreeMemberNodes =
      this.familyTreeFindRelationshipStrategy.execute({ node });

    return familyTreeMemberNodes;
  }

  addChild(params: IFamilyTreeAddChildParams): IFamilyTreeMemberNode {
    const { motherName, childName, childGender } = params;
    const motherNode = this.familyTreeMembersHashMap.get(motherName);

    if (!motherNode) {
      throw new DomainError({
        message: EDomainErrors.PERSON_NOT_FOUND,
        failures: [motherName],
      });
    }

    this.familyTreeMemberNodeBuilder.setName(childName);
    this.familyTreeMemberNodeBuilder.setGender(childGender);

    const childNode = this.familyTreeMemberNodeBuilder.build();

    motherNode.addChild(childNode);

    this.familyTreeMembersHashMap.set(childName, childNode);

    return childNode;
  }
}
