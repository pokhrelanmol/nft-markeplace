import React from "react";
import { useNft } from "../../contexts/nftContext/NftContext";
const Home = () => {
    const { Items } = useNft();
    console.log(Items[0]);
    return <div>{JSON.stringify(Items)}</div>;
};

export default Home;
