import { ethers } from "ethers";
import React, { useState } from "react";
import { ItemDetails } from "../contexts/nftContext/types";
import { getSignerAddress } from "../provider";
import Button from "./Button";
type NftProps = {
    items: ItemDetails[];
    handleBuyNft: (item: ItemDetails) => void;
};
const NftCard = ({ items, handleBuyNft }: NftProps) => {
    const [signer, setSigner] = useState<string | null>();
    (async () => setSigner(await getSignerAddress()))();
    return (
        <div>
            {items.map((item: ItemDetails, index) => (
                <div
                    className=" w-60 p-1 mt-10 h-auto shadow-md rounded-lg pb-5 pt-2 space-y-1"
                    key={index}
                >
                    <img
                        width={600}
                        height={200}
                        src={item.image}
                        alt="nft image"
                        className="mb-5"
                    />
                    <h1 className="text-gray-600 font-semibold text-lg">
                        {item.name}
                    </h1>
                    <p className="font-light text-gray-700 ">
                        {item.description}
                    </p>
                    <p>{ethers.utils.formatEther(item.totalPrice)} ETH</p>
                    {signer !== item.seller && (
                        <Button
                            buttonType="dark"
                            onClick={() => handleBuyNft(item)}
                        >
                            Buy Now
                        </Button>
                    )}
                </div>
            ))}
        </div>
    );
};

export default NftCard;
