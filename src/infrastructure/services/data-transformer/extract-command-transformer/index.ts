import {
  IDataTransformer,
  IDataTransformerParams,
} from "@root/infrastructure/interfaces/data-transformer";
import { EFamilyTreeCommands } from "@domain/constants";
import {
  EInfrastructureErrors,
  InfrastructureError,
} from "@infrastructure/constants/errors";

interface IValidation {
  command: string;
  args: Array<string>;
}

export interface ICommandArgumentsShape {
  command: EFamilyTreeCommands;
  args: Array<string>;
}

export type TExtractCommandStringTransformerResponse =
  Array<ICommandArgumentsShape>;

export class ExtractCommandStringTransformer
  implements IDataTransformer<string, TExtractCommandStringTransformerResponse>
{
  private validationMap: Map<EFamilyTreeCommands, number> = new Map([
    [EFamilyTreeCommands.ADD_CHILD, 3],
    [EFamilyTreeCommands.GET_RELATIONSHIP, 2],
    [EFamilyTreeCommands.SET_PARTNER, 3],
    [EFamilyTreeCommands.SET_FAMILY_HEAD, 2],
  ]);

  transform(params: IDataTransformerParams<string>) {
    const lines = params.data.trim().split("\n");
    const commands: TExtractCommandStringTransformerResponse = [];

    for (const line of lines) {
      const [command, ...args] = line.split(" ");

      if (this.#validate({ command, args })) {
        commands.push({ command: command as EFamilyTreeCommands, args });
      }
    }

    const v = { result: commands };
    return v;
  }

  #validate({ command, args }: IValidation): boolean {
    const limit = this.validationMap.get(command as EFamilyTreeCommands);

    if (!limit) {
      throw new InfrastructureError({
        message: EInfrastructureErrors.STRING_VALIDATION_FAILED,
        failures: [command],
      });
    } else if (limit !== args.length) {
      throw new InfrastructureError({
        message: EInfrastructureErrors.STRING_VALIDATION_FAILED,
        failures: [command, args.length, limit],
      });
    }

    return true;
  }
}
