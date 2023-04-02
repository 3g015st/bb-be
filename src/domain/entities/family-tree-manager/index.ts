import {
  IDataTransformer,
  IDataTransformerParams,
  IDataTransformerResponse,
} from "@infrastructure/interfaces/data-transformer";
import {
  IFileReader,
  IFileReaderResponse,
} from "@infrastructure/interfaces/file-reader";
import { FamilyTree, IFamilyTree } from "../family-tree";
import { FamilyTreeMemberNodeBuilder } from "../family-tree-member-node";
import {
  ICommandArgumentsShape,
  TExtractCommandStringTransformerResponse,
} from "@infrastructure/services/data-transformer/extract-command-transformer";
import {
  EFamilyTreeCommands,
  EFamilyTreeRelationships,
  EGenders,
  ESuccessfulResponses,
} from "@domain/constants";
import {
  TAddChildArgs,
  TGetRelationshipArgs,
  TSetFamilyHeadArgs,
  TSetPartnerArgs,
} from "@root/domain/interfaces";
import { IFamilyTreeGetRelationshipStrategy } from "@root/domain/strategies";
import { DomainError, EDomainErrors } from "@root/domain/errors";

import { FindChildrenStrategy } from "@root/domain/strategies/find-children-strategy";
import { FindSiblingsStrategy } from "@root/domain/strategies/find-siblings-strategy";
import { FindInLawStrategy } from "@root/domain/strategies/find-in-law-strategy";

export interface IFamilyTreeManager {
  execute(filePath: string): void;
  resetFamilyTree(): void;
}

export class FamilyTreeManager<TFileResponseType>
  implements IFamilyTreeManager
{
  private previousCommands: string;
  private readFileStrategy: IFileReader<IFileReaderResponse<TFileResponseType>>;
  private extractCommandsArgumentsStrategy: IDataTransformer<
    TFileResponseType,
    TExtractCommandStringTransformerResponse
  >;
  private familyTree: IFamilyTree;

  constructor(
    readFileStrategy: IFileReader<IFileReaderResponse<TFileResponseType>>,
    extractCommandsArgumentsStrategy: IDataTransformer<
      TFileResponseType,
      TExtractCommandStringTransformerResponse
    >
  ) {
    this.readFileStrategy = readFileStrategy;
    this.extractCommandsArgumentsStrategy = extractCommandsArgumentsStrategy;

    this.resetFamilyTree();
  }

  resetFamilyTree() {
    const familyTreeMemberNodeBuilder = new FamilyTreeMemberNodeBuilder();
    this.familyTree = new FamilyTree(familyTreeMemberNodeBuilder);
  }

  execute(filePath: string) {
    const fileContents = this.readFileStrategy.read({ location: filePath });
    const extractedCommandsArguments =
      this.extractCommandsArgumentsStrategy.transform({
        data: fileContents.data,
      });
    this.#invoke(extractedCommandsArguments);
  }

  #invoke(
    params: IDataTransformerResponse<TExtractCommandStringTransformerResponse>
  ) {
    const { result } = params;

    for (const { args, command } of result) {
      switch (command) {
        case EFamilyTreeCommands.ADD_CHILD: {
          const [motherName, childName, childGender] = args as TAddChildArgs;
          const cg = this.#setGenderRole(childGender);
          this.familyTree.addChild({ motherName, childGender: cg, childName });
          console.log(ESuccessfulResponses.CHILD_ADDED);
          break;
        }
        case EFamilyTreeCommands.GET_RELATIONSHIP: {
          const [name, relationship] = args as TGetRelationshipArgs;
          this.#handleGetRelationship({ name, relationship });
          break;
        }
        case EFamilyTreeCommands.SET_FAMILY_HEAD: {
          const [familyHeadName, familyHeadGender] = args as TSetFamilyHeadArgs;
          const fhg = this.#setGenderRole(familyHeadGender);
          this.familyTree.setRoot({ familyHeadGender: fhg, familyHeadName });
          console.log(ESuccessfulResponses.FAMILY_HEAD_SET);
          break;
        }
        case EFamilyTreeCommands.SET_PARTNER: {
          const [partnerName, newFamilyMemberName, newFamilyMemberGender] =
            args as TSetPartnerArgs;
          const nfmg = this.#setGenderRole(newFamilyMemberGender);
          this.familyTree.setPartner({
            newFamilyMemberName,
            partnerName,
            newFamilyMemberGender: nfmg,
          });
          console.log(ESuccessfulResponses.PARTNER_SET);
          break;
        }
        default: {
          console.error(EDomainErrors.COMMAND_NOT_FOUND);
          break;
        }
      }
    }
  }

  #setGenderRole(gender: EGenders) {
    if (!EGenders[gender]) {
      throw new DomainError({
        message: EDomainErrors.GENDER_NOT_FOUND,
        failures: [gender],
      });
    }

    return gender;
  }

  #pickGetRelationshipStrategy(
    relationship: EFamilyTreeRelationships
  ): IFamilyTreeGetRelationshipStrategy {
    switch (relationship) {
      case EFamilyTreeRelationships.SON: {
        return new FindChildrenStrategy(EGenders.Male);
      }
      case EFamilyTreeRelationships.DAUGHTER: {
        return new FindChildrenStrategy(EGenders.Female);
      }
      case EFamilyTreeRelationships.SIBLINGS: {
        return new FindSiblingsStrategy();
      }
      case EFamilyTreeRelationships.SISTER_IN_LAW: {
        return new FindInLawStrategy(EFamilyTreeRelationships.SISTER_IN_LAW);
      }
      case EFamilyTreeRelationships.BROTHER_IN_LAW: {
        return new FindInLawStrategy(EFamilyTreeRelationships.BROTHER_IN_LAW);
      }
      default: {
        throw new DomainError({
          message: EDomainErrors.RELATIONSHIP_TYPE_NOT_FOUND,
          failures: [relationship],
        });
      }
    }
  }

  #handleGetRelationship(params: {
    name: string;
    relationship: EFamilyTreeRelationships;
  }) {
    const { name, relationship } = params;

    try {
      const findRelationshipStrategy =
        this.#pickGetRelationshipStrategy(relationship);
      this.familyTree.setGetRelationshipStrategy(findRelationshipStrategy);

      const familyTreeMemberNodes = this.familyTree.getRelationship({ name });

      let relationshipString = "";

      if (familyTreeMemberNodes.length !== 0) {
        for (const member of familyTreeMemberNodes) {
          relationshipString = `${relationshipString} ${member?.name}`;
        }
        console.log(relationshipString);
      } else {
        console.log(ESuccessfulResponses.NO_RELATIONSHIPS);
      }
    } catch (error) {
      if (error instanceof DomainError) {
        console.error(error.payload.message, error.payload.failures);
      }
    }
  }
}
