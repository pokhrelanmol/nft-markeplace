import React from "react";
import { isTypeNode } from "typescript";
import { useNft } from "../../contexts/nftContext/NftContext";
import Button from "../Button";
import { useTransaction } from "../../contexts/TransactionContext";
import { Navigate } from "react-router-dom";
const Home = () => {
    const { items } = useNft();
    const { pending } = useTransaction();
    console.log(items[0]);
    return (
        <div>
            {items.length > 0 && !pending ? (
                items.map((item, index) => (
                    <div className="w-60 h-auto p-3 " key={index}>
                        <img src={item.image} alt="nft image" />
                        <h1>{item.name}</h1>
                        <p>{item.description}</p>
                        <p>{item.totalPrice.toString()}</p>
                    </div>
                ))
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
