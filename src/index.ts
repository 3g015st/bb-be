import { FamilyTreeManager } from "./domain/entities/family-tree-manager";
import { ExtractCommandStringTransformer } from "./infrastructure/services/data-transformer/extract-command-transformer";
import { TextFileReader } from "./infrastructure/services/text-file-reader";
import prompts from "prompts";

async function run() {
  const familyTreeManager = new FamilyTreeManager<string>(
    new TextFileReader(),
    new ExtractCommandStringTransformer()
  );

  while (true) {
    const response = await prompts({
      type: "text",
      name: "fileLocation",
      message: "Please enter the file location for the family tree commands:",
    });

    familyTreeManager.execute(response.fileLocation);

    const confirmation = await prompts({
      type: "toggle",
      name: "resetFile",
      message:
        "Do you want to reset the family tree before proceeding with another set of commands?",
      active: "Yes",
      inactive: "No",
      initial: true,
    });

    if (confirmation.resetFile) {
      familyTreeManager.resetFamilyTree();
    }
  }
}

run();
