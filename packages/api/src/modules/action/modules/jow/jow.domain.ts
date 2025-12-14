export interface JowEntity {
  _id: string;
}

export interface JowRecipe extends JowEntity {
  title: string;
  imageUrl: string;
  cookingTime: number;
  preparationTime: number;
  preparationExtraTimePerCover: number;
  additionalConstituents: JowConstituent[];
  constituents: JowConstituent[];
  directions: JowDirection[];
  seasons: string[];
  family: JowFamily;
  familyAncestors: JowFamily[];
  nutritionalrating: JowNutritionalRating;
  requiredTools: JowTool[];
  tags: JowTag[];
}

export interface JowNutritionalRating {
  etiquettable: JowEtiquettable;
}

export interface JowEtiquettable extends JowEntity {
  calories: number;
  caloriesPer100: number;
}

export interface JowFamily extends JowEntity {
  name: string;
}

export interface JowConstituent extends JowEntity {
  ingredient: JowIngredient;
  quantityPerCover: number;
  unit: JowUnit;
}

export interface JowIngredient extends JowEntity {
  name: string;
  imageUrl: string;
  naturalUnit: JowUnit;
  alternativeUnits: JowAlternativeUnit[];
}

export interface JowUnit extends JowEntity {
  name: string;
  isNatural?: true;
  abbreviations: JowAbbreviation[];
}

export interface JowAlternativeUnit extends JowEntity {
  unit: JowUnit;
  quantity: number;
}

export interface JowEditorialData {
  nutritionalFacts: JowNutritionalFact[];
}

export interface JowNutritionalFact extends JowEntity {
  amount: number;
  portion: number;
  code: string;
}

export interface JowAbbreviation extends JowEntity {
  label: string;
  digits: number;
  divisor: number;
  minAmount?: number;
  maxAmount?: number;
}

export interface JowDirection extends JowEntity {
  label: string;
}

export interface JowRecipesWithAdditionalIngredients {
  recipes: JowRecipe[];
}

export interface JowTool extends JowEntity {
  name: string;
  imageUrl: string;
  isDefaultChecked: boolean;
  isNotTrivial: boolean;
}

export interface JowTag extends JowEntity {
  name: string;
}
