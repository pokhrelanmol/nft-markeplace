import { JsonRpcProvider } from "@ethersproject/providers";
import React, { ReactNode } from "react";
import { getProvider, getSignerAddress } from "../provider";

interface WalletProps {
    walletAddress: string;
    setWalletAddress: React.Dispatch<React.SetStateAction<string>>;
}

type ProviderProps = {
    children: ReactNode;
};

const WalletContext = React.createContext<WalletProps>({} as WalletProps);

export const WalletProvider = ({ children }: ProviderProps) => {
    const [walletAddress, setWalletAddress] = React.useState<string>("");
    const [provider, setProvider] = React.useState<JsonRpcProvider>();
    React.useEffect(() => {
        async function init() {
            const _provider = await getProvider();
            const signerAddress = await getSignerAddress();
            setWalletAddress(signerAddress as unknown as string);
            setProvider(_provider);
        }
        init();
    }, [walletAddress]);
    if (provider) {
        (window as any).ethereum.on(
            "accountsChanged",
            function (accounts: any) {
                setWalletAddress(accounts[0].address);
            }
        );
    }
    return (
        <WalletContext.Provider
            value={{
                walletAddress,
                setWalletAddress,
            }}
        >
            {children}
        </WalletContext.Provider>
    );
};

export const useWallet = () => React.useContext(WalletContext);
