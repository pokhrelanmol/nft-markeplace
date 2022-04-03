import { ItemDetails, MarketState, NewItem } from "./types.d.";
export type transactionStateType = {
    pending: boolean;
    setPending: React.Dispatch<React.SetStateAction<boolean>>;
};
export enum actionTypes {
    "FETCH_NFT" = "FETCH_NFT_ITEMS",
    "CREATE_NFT" = "CREATE_NEW_NFT",
    "BUY_NFT" = "BUY_NFT",
}

type FETCH_NFT = {
    type: actionTypes.FETCH_NFT;
    payload: MarketState;
};
type CREATE_NFT = {
    type: actionTypes.CREATE_NFT;
    payload: {
        items: NewItem;
        transactionState: transactionStateType;
    };
};
type BUY_NFT = {
    type: actionTypes.BUY_NFT;
    payload: NewItem;
};

export type Actions = CREATE_NFT | BUY_NFT | FETCH_NFT;
