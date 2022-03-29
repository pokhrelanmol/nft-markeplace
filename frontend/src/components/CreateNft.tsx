import React, { useState } from "react";
import Input from "./Input";
import FileBase64 from "react-file-base64";
import Button from "./Button";
import { actionTypes, useNft } from "../contexts/nftContext/NftContext";
// import { getIPFSHTTPCLIENT } from "../helpers";

const CreateNft = () => {
    const { dispatch } = useNft();
    const [image, setImage] = React.useState("");

    const [formData, setFormData] = useState({
        image: "",
        name: "",
        description: "",
        price: "",
    });

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { value, name } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleClick = () => {
        if (
            !formData.image ||
            !formData.price ||
            !formData.description ||
            !formData.name
        ) {
            // TODO:use toast notification here
            alert("all field are required");
        } else {
            dispatch({ type: actionTypes.CREATE_NFT, payload: formData });
            setFormData({
                image: "",
                name: "",
                description: "",
                price: "",
            });
        }
    };
    return (
        <div className="flex flex-col items-center m-auto justify-center w-8/12 space-y-5 mt-20 p-5 border-2  ">
            <Input
                handleChange={handleChange}
                type="text"
                placeholder="Name"
                name="name"
                value={formData.name}
            />
            <Input
                handleChange={handleChange}
                type="number"
                placeholder="Price"
                name="price"
                value={formData.price}
            />
            <Input
                handleChange={handleChange}
                type="textarea"
                placeholder="Description"
                name="description"
                value={formData.description}
            />
            {/* handle image */}
            <div className="">
                <FileBase64
                    multiple={false}
                    onDone={({ base64 }: any) => {
                        setImage(base64);
                        setFormData({ ...formData, ["image"]: base64 });
                    }}
                />
                {image !== "" ? (
                    <>
                        <img src={image} width={150} height={150} alt="" />
                    </>
                ) : null}
            </div>
            <Button buttonType="primary" onClick={handleClick}>
                Create Nfth
            </Button>
            {/* demo buy nft */}
            {/* i have a itemId as a payload params here but. it is not present in the reducer */}
            {/* <button onClick={dispatch({type:actionTypes.BUY_NFT,payload:{itemId}})}></button> */}
        </div>
    );
};

export default CreateNft;