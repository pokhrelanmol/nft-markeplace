import { transactionStateType } from "./actionsTypes";
import { Contract, ItemDetails, NewItem } from "./types.d.";

import { create } from "ipfs-http-client";
import { ethers } from "ethers";
import { setNotification } from "../../helpers/setNotification";

const IPFS = create({ url: "https://ipfs.infura.io:5001" });
export const fetchNFt = async (contract: Contract) => {
    const items: ItemDetails[] = [];
    try {
        const numberOfItemInMarketplace =
            await contract.Marketplace.itemCount();
        for (let i = 1; i <= numberOfItemInMarketplace.toString(); i++) {
            // fetch item from the items mapping providing the itemId
            const item: ItemDetails = await contract.Marketplace.items(i);
            if (!item.sold) {
                // get uri url from nft contract
                const uri = await contract.Nft.tokenURI(item.tokenId);
                // use uri to fetch the nft metadata stored on ipfs
                const response = await fetch(uri);
                const metadata = await response.json();
                // get total price of item (item price + marketFee)
                const totalPrice = await contract.Marketplace.getTotalPrice(
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
        // items are present here
        console.log(items);
        return items;
        // return Promise.resolve(items);
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
            mintNft(result.path);
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
        //  * Offered event will fire after listing nft
    };
};
