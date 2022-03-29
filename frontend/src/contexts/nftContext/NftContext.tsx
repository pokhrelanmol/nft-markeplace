import {
    createContext,
    useContext,
    useEffect,
    useReducer,
    useState,
} from "react";
import { getProvider } from "../../provider";
import { ethers } from "ethers";
import MarketplaceAddress from "../../deployedAddress/Marketplace-address.json";
import MarketPlaceAbi from "../../abis/Marketplace.json";
import NFTAddress from "../../deployedAddress/NFT-address.json";
import NFTAbi from "../../abis/NFT.json";
import { ItemDetails, NewItem, ProviderProps } from "./types";
import { create } from "ipfs-http-client";
const IPFS = create({ url: "https://ipfs.infura.io:5001" });

export enum actionTypes {
    "FETCH_NFT" = "FETCH_NFT_ITEMS",
    "CREATE_NFT" = "CREATE_NEW_NFT",
    "BUY_NFT" = "BUY_NFT",
}

type FETCH_NFT = {
    type: actionTypes.FETCH_NFT;
    // payload: ItemDetails;
};
type CREATE_NFT = {
    type: actionTypes.CREATE_NFT;
    payload: NewItem;
};
type BUY_NFT = {
    type: actionTypes.BUY_NFT;
    payload: {
        totalPrice: number;
        itemId: number;
        seller: string;
        name: string;
        description: string;
        image: string;
        sold?: boolean;
        tokenId?: number;
    };
};
type Contract = {
    Marketplace: any;
    Nft: any;
};
export type MarketState = ItemDetails[];

const initialState: [] = [];
type Actions = CREATE_NFT | BUY_NFT | FETCH_NFT;
let contract: Contract = {
    Marketplace: {},
    Nft: {},
};
const reducer = (state: MarketState, action: Actions): MarketState => {
    switch (action.type) {
        case actionTypes.FETCH_NFT:
            // !Dispatch this on first render
            const items: ItemDetails[] = [];
            const loadListedNfts = async () => {
                const numberOfItemInMarketplace =
                    await contract.Marketplace.itemCount();
                for (let i = 0; i < numberOfItemInMarketplace; i++) {
                    // fetch item from the items mapping providing the itemId

                    const item: ItemDetails = await contract.Marketplace.items(
                        i
                    );
                    if (!item.sold) {
                        // get uri url from nft contract
                        const uri = await contract.Nft.tokenURI(item.tokenId);
                        // use uri to fetch the nft metadata stored on ipfs
                        const response = await fetch(uri);
                        const metadata = await response.json();
                        // get total price of item (item price + marketFee)
                        const totalPrice =
                            await contract.Marketplace.getTotalPrice(
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
                        // i dont know if below code gonna work or not if it doesnt work try above code

                        // return [
                        //     ...state,
                        //     {
                        //         totalPrice,
                        //         itemId: item.itemId,
                        //         seller: item.seller,
                        //         name: metadata.name,
                        //         description: metadata.description,
                        //         image: metadata.image,
                        //     },
                        // ];
                    }
                }
            };

            return [...state, ...items];
            break;
        case actionTypes.CREATE_NFT:
            const { image, name, description, price } = action.payload;
            const createNft = async () => {
                try {
                    const result = await IPFS.add(
                        JSON.stringify({ image, price, name, description })
                    );
                    console.log(result);
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
                const list = await contract.Marketplace.listNft(
                    contract.Nft.address,
                    id,
                    listingPrice
                );
                list.wait();
                //  * Offered event will fire after listing nft
            };
            return [...state];
            break;
        case actionTypes.BUY_NFT:
            const buyNft = async () => {
                const buy = await contract.Marketplace
                    .purchaseItem
                    // !ERROR HERE
                    // action.payload.itemId
                    ();
            };
            return [...state];
            break;
        default:
            return initialState;
            break;
    }
};

type ContextArgs = {
    Items: MarketState;
    dispatch: React.Dispatch<Actions>;
};
const NftContext = createContext<ContextArgs>({
    Items: [],
    dispatch: () => null,
});
export const NftProvider = ({ children }: ProviderProps) => {
    const [state, dispatch] = useReducer(reducer, initialState);

    const init = async () => {
        const _provider = await getProvider();
        const signer = _provider.getSigner();
        const MarketplaceContract = new ethers.Contract(
            MarketplaceAddress.address,
            MarketPlaceAbi.abi,
            signer
        );
        const NFTContract = new ethers.Contract(
            NFTAddress.address,
            NFTAbi.abi,
            signer
        );
        contract = { Marketplace: MarketplaceContract, Nft: NFTContract };
    };

    useEffect(() => {
        init();
    }, []);
    return (
        <NftContext.Provider value={{ Items: state, dispatch }}>
            {children}
        </NftContext.Provider>
    );
};

export const useNft = () => useContext(NftContext);
