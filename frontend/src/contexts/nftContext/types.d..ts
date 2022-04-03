import { Actions } from "./actionsTypes";

export interface NewItem {
    name: string;
    description: string;
    image: string;
    price: number | string;
}
export interface ItemDetails {
    totalPrice: number;
    itemId: number;
    seller: string;
    name: string;
    description: string;
    image: string;
    sold?: boolean;
    tokenId?: number;
}
[];

export type ProviderProps = {
    children: React.ReactNode;
};

export type MarketState = ItemDetails[];
export type Contract = {
    Marketplace: any;
    Nft: any;
};
export type ContextArgs = {
    items: MarketState;
    dispatch: React.Dispatch<Actions>;
};
