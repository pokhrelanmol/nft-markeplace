import { EtherscanProvider } from "@ethersproject/providers";
import { ethers } from "ethers";
import { Actions, transactionStateType } from "./actions";

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
    Marketplace: ethers.Contract;
    Nft: ethers.Contract;
};
export type ContextArgs = {
    items: MarketState;
    dispatch: React.Dispatch<Actions>;
    createNewNft: (
        item: NewItem,
        transactionState: transactionStateType
    ) => Promise<void>;
    handleBuyNft: (
        item: ItemDetails
        // transactionState: transactionStateType
    ) => Promise<void>;
    contract: {
        Nft: ethers.Contract;
        Marketplace: ethers.Contract;
    };
};
