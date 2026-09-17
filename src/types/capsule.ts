export type Rarity = "common" | "rare" | "legendary";

export interface GachaCapsule {
  id: string;
  imageUrl: string;
  rarity: Rarity;
}
