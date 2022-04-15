import { Contract, ItemDetails, MarketState, NewItem } from "./types";

import { create } from "ipfs-http-client";
import { ethers } from "ethers";
import { setNotification } from "../../helpers/setNotification";

const IPFS = create({ url: "https://ipfs.infura.io:5001" });
export type transactionStateType = {
    pending: boolean;
    setPending: React.Dispatch<React.SetStateAction<boolean>>;
};
export enum actionTypes {
    "FETCH_NFT" = "FETCH_NFT_ITEMS",
    "CREATE_NFT" = "CREATE_NEW_NFT",
    "BUY_NFT" = "BUY_NFT",
}

type FETCH_NFT = {
    type: actionTypes.FETCH_NFT;
    payload: MarketState;
};
type CREATE_NFT = {
    type: actionTypes.CREATE_NFT;

    // payload: {
    //     items: NewItem;
    //     transactionState: transactionStateType;
    // };
};
type BUY_NFT = {
    type: actionTypes.BUY_NFT;
    payload: NewItem;
};

export type Actions = CREATE_NFT | BUY_NFT | FETCH_NFT;

// functions to handle actions
export const fetchNFt = async (marketContract: any, nftContract: any) => {
    const items: ItemDetails[] = [];
    try {
        const numberOfItemInMarketplace = await marketContract.itemCount();
        for (let i = 1; i <= numberOfItemInMarketplace.toString(); i++) {
            // fetch item from the items mapping providing the itemId
            const item: ItemDetails = await marketContract.items(i);
            if (!item.sold) {
                // get uri url from nft contract
                const uri = await nftContract.tokenURI(item.tokenId);
                // use uri to fetch the nft metadata stored on ipfs
                const response = await fetch(uri);
                const metadata = await response.json();
                // get total price of item (item price + marketFee)
                const totalPrice = await marketContract.getTotalPrice(
                    item.itemId
                );
                items.push({
                    totalPrice,
                    itemId: item.itemId,
                    seller: item.seller,
                    name: metadata.name,
                    description: metadata.description,
                    image: metadata.image,
                });
            }
        }

        return items;
    } catch (error) {
        console.log(error);
    }
};
export const createNft = async (
    contract: Contract,
    item: NewItem,
    transactionState: transactionStateType
) => {
    const { image, name, description, price } = item;
    const { setPending } = transactionState;

    const createNft = async () => {
        try {
            const result = await IPFS.add(
                JSON.stringify({ image, price, name, description })
            );
            // pass the  uri path to the mintThenList function

            await mintNft(result.path);
            window.location.href = "/";
        } catch (error) {
            console.log("ipfs uri upload error: ", error);
        }
    };
    createNft();
    // mintNft
    const mintNft = async (path: string) => {
        const URI = `https://ipfs.infura.io/ipfs/${path}`;
        const mint = await contract.Nft.mint(URI);
        setPending(true);
        mint.wait();

        // get tokenId of new nft
        const id = await contract.Nft.tokenCount();
        // approve marketplace to spend nft
        const approve = await contract.Nft.setApprovalForAll(
            contract.Marketplace.address,
            true
        );

        approve.wait();

        // add nft to marketplace
        const listingPrice = ethers.utils.parseEther(price.toString());
        const list = await contract.Marketplace.listItem(
            contract.Nft.address,
            id,
            listingPrice
        );

        list.wait();
        setPending(false);

        setNotification({
            message: "Hooray! Your NFT is created and listed successfully",
            type: "success",
        });
        return list;
    };
};
export const buyNft = async (
    itemId: number,
    totalPrice: number,
    marketplace: ethers.Contract
) => {
    await (
        await marketplace.purchaseItem(itemId, { value: totalPrice })
    ).wait();

    console.log(itemId);
};
