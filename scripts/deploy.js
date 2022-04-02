async function main() {
    const [deployer] = await ethers.getSigners();

    console.log("Deploying contracts with the account:", deployer.address);
    console.log("Account balance:", (await deployer.getBalance()).toString());

    // Get the ContractFactories and Signers here.
    const NFT = await ethers.getContractFactory("NFT");
    const Marketplace = await ethers.getContractFactory("Marketplace");
    // deploy contracts
    const marketplace = await Marketplace.deploy(1);
    const nft = await NFT.deploy();
    // Save copies of each contracts abi and address to the frontend.
    saveFrontendFiles(marketplace, "Marketplace");
    saveFrontendFiles(nft, "NFT");
}

function saveFrontendFiles(contract, name) {
    const fs = require("fs");
    const abis = __dirname + "/../frontend/src/abis";
    const deployedAddress = __dirname + "/../frontend/src/deployedAddress";
    if (!fs.existsSync(abis && deployedAddress)) {
        fs.mkdirSync(abis);
        fs.mkdirSync(deployedAddress);
    }
    console.log(`${name} address => ${contract.address}`);
    fs.writeFileSync(
        deployedAddress + `/${name}-address.json`,
        JSON.stringify({ address: contract.address }, undefined, 2)
    );

    const contractArtifact = artifacts.readArtifactSync(name);

    fs.writeFileSync(
        abis + `/${name}.json`,
        JSON.stringify(contractArtifact, null, 2)
    );
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
