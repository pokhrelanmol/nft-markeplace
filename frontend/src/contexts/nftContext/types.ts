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
