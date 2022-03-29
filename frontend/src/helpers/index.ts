// import { create, IPFSHTTPClient } from "ipfs-http-client";
export const getTruncatedAddress = (address: string) => {
    return `${address.slice(0, 4)}...${address.slice(address.length - 2)}`;
};
export const joinClasses = (...classes: string[]) => {
    return classes.join(" ");
};
// export const getIPFSHTTPCLIENT = (): IPFSHTTPClient => {
//     return create({ url: "https://ipfs.infura.io:5001" });
// };
