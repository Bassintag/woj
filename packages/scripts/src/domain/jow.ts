export interface JowEntity {
  _id: string;
}

export interface JowRecipe extends JowEntity {
  title: string;
  imageUrl: string;
  cookingTime: number;
  preparationTime: number;
  constituents: JowConstituent[];
  directions: JowDirection[];
  seasons: string[];
  family: JowFamily;
  familyAncestors: JowFamily[];
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
  editorialData: JowEditorialData;
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
