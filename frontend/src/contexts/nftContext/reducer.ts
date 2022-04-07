import { Actions, actionTypes } from "./actions";
import { createNft } from "./actions";
import { MarketState } from "./types";
export const initialState: [] = [];
export const reducer = (state: MarketState, action: Actions): MarketState => {
    switch (action.type) {
        case actionTypes.FETCH_NFT:
            // get Market state through the payload
            const newState = [...action.payload];
            console.log(newState);
            return newState;

        case actionTypes.CREATE_NFT:
            //?  if i redirect user them am i able to fetch the data again?

            return state;
            break;

        default:
            return state;
    }
};
