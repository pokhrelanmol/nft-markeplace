import { useNft } from "../../contexts/nftContext/NftContext";
import Button from "../Button";
import { useTransaction } from "../../contexts/TransactionContext";
import { useWallet } from "../../contexts/WalletContext";
import { ethers } from "ethers";
import NftCard from "../NftCard";
const Home = () => {
    const { items, handleBuyNft } = useNft();
    const { pending } = useTransaction();
    const { walletAddress } = useWallet();

    return (
        <div className="flex space-x-8 ">
            {items.length > 0 && !pending && walletAddress ? (
                <NftCard items={items} handleBuyNft={handleBuyNft} />
            ) : !walletAddress ? (
                <div className="text-5xl text-center relative top-48 text-yellow-700">
                    Hey, Please connect your Wallet First
                </div>
            ) : (
                <div className="text-5xl text-center relative top-48 text-yellow-700">
                    sad! market place have no items to display
                    {/* <button buttontype="primary" onclick={navigate("/create")}>
                        create some
                    </button> */}
                </div>
            )}
        </div>
    );
};

export default Home;
