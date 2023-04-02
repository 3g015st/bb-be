import { IFamilyTreeMemberNode } from "@root/domain/entities/family-tree-member-node";

export interface IFamilyTreeGetRelationshipStrategyParams {
  node: IFamilyTreeMemberNode;
}

export interface IFamilyTreeGetRelationshipStrategy {
  execute(
    params: IFamilyTreeGetRelationshipStrategyParams
  ): Array<IFamilyTreeMemberNode> | Array<null>;
}
