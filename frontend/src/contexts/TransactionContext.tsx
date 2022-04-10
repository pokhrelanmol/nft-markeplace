import React from "react";
interface TransactionType {
    pending: boolean;
    setPending: React.Dispatch<React.SetStateAction<boolean>>;
}
type ProviderProps = {
    children: React.ReactNode;
};
export const TransactionContext = React.createContext<TransactionType>({
    pending: false,
    setPending: () => {},
} as TransactionType);
export const TransactionProvider = ({ children }: ProviderProps) => {
    const [pending, setPending] = React.useState(true);
    return (
        <TransactionContext.Provider value={{ pending, setPending }}>
            {children}
        </TransactionContext.Provider>
    );
};

export const useTransaction = () => React.useContext(TransactionContext);
