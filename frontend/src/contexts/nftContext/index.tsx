import { createContext, useReducer } from "react";
import { initialState, reducer } from "./reducer";
import { ContextArgs, ProviderProps } from "./types.d.";

export const NftContext = createContext<ContextArgs>({
    items: [],
    dispatch: () => null,
});
export const NftContextProvider = ({ children }: ProviderProps) => {
    const [state, dispatch] = useReducer(reducer, initialState);
    return (
        <NftContext.Provider value={{ items: state, dispatch }}>
            {children}
        </NftContext.Provider>
    );
};
