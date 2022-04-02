import React from "react";
import { isTypeNode } from "typescript";
import { useNft } from "../../contexts/nftContext/NftContext";
const Home = () => {
    const { Items } = useNft();
    console.log(Items[0]);
    return (
        <div>
            <div>
                {Items ? (
                    Items.map((item) => (
                        <div className="w-60 h-auto p-3 ">
                            <img src={item.image} alt="nft image" />
                            <h1>{item.name}</h1>
                            <p>{item.description}</p>
                            <p>{item.totalPrice}</p>
                        </div>
                    ))
                ) : (
                    <div></div>
                )}
            </div>
        </div>
    );
};

export default Home;
