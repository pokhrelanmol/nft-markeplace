import React from "react";
import { isTypeNode } from "typescript";
import { useNft } from "../../contexts/nftContext/NftContext";
import Button from "../Button";
import { Navigate } from "react-router-dom";
const Home = () => {
    const { Items } = useNft();
    console.log(Items[0]);
    return (
        <div>
            {Items.length > 0 ? (
                Items.map((item) => (
                    <div className="w-60 h-auto p-3 ">
                        <img src={item.image} alt="nft image" />
                        <h1>{item.name}</h1>
                        <p>{item.description}</p>
                        <p>{item.totalPrice}</p>
                    </div>
                ))
            ) : (
                <div className="text-5xl text-center relative top-48 text-yellow-700">
                    Sad! Market Place have no Items to Display
                    {/* <Button buttonType="primary" onClick={Navigate("/create")}>
                        Create Some
                    </Button> */}
                </div>
            )}
        </div>
    );
};

export default Home;
