import { Actions, actionTypes } from "./actionsTypes";
import { createNft } from "./functions";
import { MarketState } from "./types.d.";

export const initialState: [] = [];
export const reducer = (state: MarketState, action: Actions): MarketState => {
    switch (action.type) {
        case actionTypes.FETCH_NFT:
            // get Market state through the payload
            const newState = [...action.payload];
            return newState;
        case actionTypes.CREATE_NFT:
            // call createNft Function  with @args provided in payload
            return state;
            break;

        default:
            return state;
    }
};
