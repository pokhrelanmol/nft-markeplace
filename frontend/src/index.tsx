import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import { WalletProvider } from "./contexts/WalletContext";
import { TransactionProvider } from "./contexts/TransactionContext";
import { NftProvider } from "./contexts/nftContext/NftContext";

ReactDOM.render(
    <React.StrictMode>
        <WalletProvider>
            <TransactionProvider>
                <NftProvider>
                    <App />
                </NftProvider>
            </TransactionProvider>
        </WalletProvider>
    </React.StrictMode>,
    document.getElementById("root")
);
