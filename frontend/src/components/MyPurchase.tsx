import React, { useEffect, useState } from "react";
import { useNft } from "../contexts/nftContext/NftContext";
import { ItemDetails } from "../contexts/nftContext/types";
import { getSignerAddress } from "../provider";

const MyPurchase = () => {
    const [purchases, setPurchases] = useState<ItemDetails[]>([]);
    const { contract } = useNft();
    async function fetchBoughtNft() {
        //  here is the use of the index property that we have used in a buyer at contract
        const filter = contract.Marketplace.filters.Bought(
            null,
            null,
            null,
            null,
            null,
            await getSignerAddress()
        );
        const result = await contract.Marketplace.queryFilter(filter);
        //   because result.map have to perform multple async operation so we need to wrap it inside promise.all()
        const purchases = await Promise.all(
            result.map(async (_item) => {
                const item: any = _item.args;
                const uri = await contract.Nft.tokenURI(item.tokenId);
                const response = await fetch(uri);
                const metadata = await response.json();
                // get total price of item (item price + fee)

                const totalPrice = await contract.Marketplace.getTotalPrice(
                    item.itemId
                );
                let purchasedItems = {
                    totalPrice,
                    price: item.price,
                    itemId: item.itemId,
                    name: metadata.name,
                    description: metadata.description,
                    image: metadata.image,
                    //   seller: item.seller,
                };
                console.log(purchasedItems);
                return purchasedItems;
            })
        );
        setPurchases(purchases as unknown as ItemDetails[]);
    }

    useEffect(() => {
        fetchBoughtNft();
    }, []);

    return <div>{JSON.stringify(purchases)}</div>;
};

export default MyPurchase;
