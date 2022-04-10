import { ethers } from "ethers";
import {
    createContext,
    useContext,
    useEffect,
    useReducer,
    useState,
} from "react";
import { getProvider } from "../../provider";
import { initialState, reducer } from "./reducer";
import {
    ContextArgs,
    Contract,
    ItemDetails,
    MarketState,
    NewItem,
    ProviderProps,
} from "./types";
import MarketplaceAddress from "../../deployedAddress/Marketplace-address.json";
import MarketPlaceAbi from "../../abis/Marketplace.json";
import NFTAddress from "../../deployedAddress/NFT-address.json";
import { actionTypes, fetchNFt } from "./actions";
import NFTAbi from "../../abis/NFT.json";
import { useTransaction } from "../TransactionContext";
import { createNft, transactionStateType } from "./actions";
import { Provider } from "@ethersproject/providers";
import { isJsxFragment } from "typescript";
// import { useNavigate } from "react-router-dom";
export const NftContext = createContext<ContextArgs>({} as ContextArgs);
export const NftProvider = ({ children }: ProviderProps) => {
    const [contract, setContract] = useState<Contract>({} as Contract);
    const [state, dispatch] = useReducer(reducer, initialState);
    const { setPending } = useTransaction();
    // let navigate = useNavigate();
    const init = async () => {
        setPending(true);
        const provider = await getProvider();
        const signer = provider.getSigner();
        const MarketplaceContract = new ethers.Contract(
            MarketplaceAddress.address,
            MarketPlaceAbi.abi,
            signer
        );
        const NftContract = new ethers.Contract(
            NFTAddress.address,
            NFTAbi.abi,
            signer
        );
        setContract({
            Marketplace: MarketplaceContract,
            Nft: NftContract,
        });
        const marketState: MarketState = (await fetchNFt(
            MarketplaceContract,
            NftContract
        )) as unknown as MarketState;
        if (await signer.getAddress()) {
            dispatch({ type: actionTypes.FETCH_NFT, payload: marketState });
        }
        setPending(false);
    };
    useEffect(() => {
        init();
    }, []);
    async function handleCreateNft(
        item: NewItem,
        transactionState: transactionStateType
    ) {
        try {
            const newNft = await createNft(contract, item, transactionState);
            dispatch({ type: actionTypes.CREATE_NFT });
        } catch (error) {
            console.log(error);
        }
    }
    // contract.Marketplace.on("Offered",async(itemId:string,nft:any,tokenId:string)=>{
    //  ?do i need to fetch all the data here or just simply redirect user
    // })
    return (
        <NftContext.Provider
            value={{ items: state, dispatch, createNewNft: handleCreateNft }}
        >
            {children}
        </NftContext.Provider>
    );
};

export const useNft = () => useContext(NftContext);
