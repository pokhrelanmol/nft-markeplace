import React, { useEffect, useState } from "react";
import { convertToObject, JSDocUnknownType } from "typescript";
import { useNft } from "../contexts/nftContext/NftContext";
import { ItemDetails } from "../contexts/nftContext/types";
import { getSignerAddress } from "../provider";
import NftCard from "./NftCard";

const MyListedNft = () => {
    const { contract } = useNft();
    const [listedItems, setListedItems] = useState<ItemDetails[]>(
        [] as ItemDetails[]
    );
    const [soldItems, setSoldItems] = useState<ItemDetails[]>(
        [] as ItemDetails[]
    );

    const fetchListedItems = async () => {
        let _listedItems: ItemDetails[] = [] as unknown as ItemDetails[];
        let _soldItems: ItemDetails[] = [] as unknown as ItemDetails[];
        const itemCount = await contract.Marketplace.itemCount();
        for (let i = 1; i <= itemCount; i++) {
            const item = await contract.Marketplace.items(i);

            if (item.seller === (await getSignerAddress())) {
                const uri = await contract.Nft.tokenURI(item.itemId);
                // use uri to fetch the nft metadata stored on ipfs
                const response = await fetch(uri);
                const metadata = await response.json();
                // get total price of item (item price + fee)

                const totalPrice = await contract.Marketplace.getTotalPrice(
                    item.itemId
                );
                let _item = {
                    totalPrice,
                    price: item.price,
                    itemId: item.itemId,
                    name: metadata.name,
                    description: metadata.description,
                    image: metadata.image,
                    seller: item.seller,
                };
                _listedItems.push(_item as unknown as ItemDetails);

                // define listed item object
                // Add listed item to sold items array if sold
                if (item.sold) _soldItems.push(_item as unknown as ItemDetails);
            }
        }
        setListedItems(_listedItems);
        setSoldItems(_soldItems);
    };
    useEffect(() => {
        fetchListedItems();
    }, []);
    return (
        <div className="flex p-8">
            {listedItems.length > 0 ? (
                <NftCard items={listedItems} handleBuyNft={() => {}} />
            ) : (
                <div className="text-5xl text-center relative top-48 text-yellow-700">
                    sad! market place have no items to display
                </div>
            )}
        </div>
    );
};

export default MyListedNft;
