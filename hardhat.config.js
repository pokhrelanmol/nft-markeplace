require("@nomiclabs/hardhat-waffle");

module.exports = {
    solidity: "0.8.4",
    networks: {
        hardhat: {
            chainId: 1337,
            accounts: {
                mnemonic:
                    "test test test test test test test test test test test junk", // test test test test test test test test test test test junk
            },
        },
        // ropsten: {
        //     url: process.env.ROPSTEN_URL,
        //     accounts: [`0x${process.env.PRIVATE_KEY as string}`],
        // },
    },
};
