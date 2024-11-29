import { Tool, ToolParams } from "@langchain/core/tools";
import { CategoriesService } from "./categories.service";

export class CategoriesTool extends Tool {
  constructor(
    private readonly categoriesService: CategoriesService,
    fields?: ToolParams
  ) {
    super(fields);
  }
  static lc_name() {
    return "CategoriesTool";
  }
  name = "categories";

  description =
    "A repository of budgeting categories. Input should be a search term. It returns an identifier if there is a match or `null`";

  async _call(input: string): Promise<string | null> {
    console.log("_call");
    const category = this.categoriesService.findOne(input);
    if (!category) {
      return null;
    }

    console.log("here", input, category, category.externalId);
    return category.externalId;
  }
}

