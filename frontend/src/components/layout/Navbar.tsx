import React, { useEffect } from "react";
import { getSignerAddress } from "../../provider";
import Button from "../Button";
import { useTransaction } from "../../contexts/TransactionContext";
import { useWallet } from "../../contexts/WalletContext";
import CircularLoader from "../CircularLoader";
import { getTruncatedAddress } from "../../helpers";
import { setNotification } from "../../helpers/setNotification";
import NotificationBar from "../NotificationBar";
const Navbar = () => {
    const { pending } = useTransaction();
    const { walletAddress, setWalletAddress } = useWallet();

    const connectWallet = async () => {
        const ethereum = (window as any).ethereum;
        if (ethereum) {
            await ethereum.request({ method: "eth_requestAccounts" });
        }
        const address = await getSignerAddress();
        if (address && setWalletAddress) {
            setWalletAddress(address);
            setNotification({
                message: "Wallet connected successfully!",
                type: "success",
            });
        }
    };
    return (
        <nav className="flex justify-around items-center mt-5 w-full shadow-sm p-2 ">
            {/* logo */}
            <div>
                <img
                    className=" w-14 h-14 rounded-2xl"
                    src="https://img.freepik.com/free-vector/neon-art-pattern-with-nft-game-background-design-crypto-currency-finance-concept-currency-icon_100456-4816.jpg"
                    alt=""
                />
            </div>
            {/* links */}
            <ul className="flex space-x-5">
                <link className="text-medium hover:border-b hover:border-blue-500 cursor-pointer">
                    Home
                </link>
                <li className="text-medium hover:border-b hover:border-blue-500 cursor-pointer">
                    Create
                </li>
                <li className="text-medium hover:border-b hover:border-blue-500 cursor-pointer">
                    My NFT
                </li>
            </ul>
            {/* connect wallet */}
            <div>
                {pending ? (
                    <Button buttonType="dark">
                        <CircularLoader />
                    </Button>
                ) : walletAddress ? (
                    <Button disable={true}>
                        {getTruncatedAddress(walletAddress)}
                    </Button>
                ) : (
                    <Button onClick={connectWallet} buttonType="primary">
                        Connect Wallet
                    </Button>
                )}
            </div>
            <NotificationBar />
        </nav>
    );
};

export default Navbar;
