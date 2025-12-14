export interface RecipeData {
  name: string;
  cookingTime?: number;
  preppingTime?: number;
  energy?: number;
  imageUrl?: string;
  constituents: ConsitituentData[];
  steps: StepData[];
  tags: TagData[];
  tools: ToolData[];
}

export interface StepData {
  description: string;
}

export interface TagData {
  name: string;
}

export interface ConsitituentData {
  quantity: number;
  ingredient: IngredientData;
  unit: UnitData;
}

export interface IngredientData {
  name: string;
  imageUrl?: string;
  defaultUnit: UnitData;
  conversions: ConversionData[];
}

export interface ConversionData {
  factor: number;
  unit: UnitData;
}

export interface UnitData {
  name: string;
  symbols: SymbolData[];
}

export interface SymbolData {
  name: string;
  digits?: number;
  factor: number;
  min: number;
  max: number;
}

export interface ToolData {
  name: string;
  imageUrl: string;
  trivial: boolean;
}

export interface SourceAdapter {
  listRecipes(): AsyncIterable<RecipeData>;
}
