const { expect } = require("chai");
const { ethers } = require("hardhat");

const toWei = (num) => ethers.utils.parseEther(num.toString());
const fromWei = (num) => ethers.utils.formatEther(num);

describe("NFTMarketplace", async function () {
    let deployer,
        addr1,
        addr2,
        marketplace,
        nft,
        addrs,
        feePercent = 1;

    beforeEach(async function () {
        const MarketPlace = await ethers.getContractFactory("Marketplace");
        const NFT = await ethers.getContractFactory("NFT");
        marketplace = await MarketPlace.deploy(1);

        nft = await NFT.deploy();
        await marketplace.deployed();
        await nft.deployed();
        [deployer, addr1, addr2, ...addrs] = await ethers.getSigners();
    });

    describe("Deployement", async function () {
        it("should track the name and symbol of nft collectionk", async function () {
            expect(await nft.name()).to.equal("DApp NFT");
            expect(await nft.symbol()).to.equal("DAPP");
        });
        it("should track the feeAccount and  feePercent of the marketplace", async function () {
            expect(await marketplace.feeAccount()).to.equal(deployer.address);
            expect(await marketplace.feePercent()).to.equal(1);
        });
    });
    describe("MintingNFT", function () {
        it("should track each minted nft", async function () {
            await nft.connect(addr1).mint("sample URI");
            expect(await nft.tokenCount()).to.equal(1);
            expect(await nft.balanceOf(addr1.address)).to.equal(1);
            expect(await nft.tokenURI(1)).to.equal("sample URI");

            await nft.connect(addr1).mint("sample URI1");
            expect(await nft.tokenCount()).to.equal(2);
            expect(await nft.balanceOf(addr1.address)).to.equal(2);
            expect(await nft.tokenURI(2)).to.equal("sample URI1");

            await nft.connect(addr2).mint("sample URI 2");
            expect(await nft.tokenCount()).to.equal(3);
            expect(await nft.balanceOf(addr2.address)).to.equal(1);
            expect(await nft.tokenURI(3)).to.equal("sample URI 2");
        });
    });
    describe("Making NFT items", function () {
        beforeEach(async function () {
            // addr1 mints an nft
            await nft.connect(addr1).mint("sample URI");
            // addr1 approve marketplace to spend nft
            await nft
                .connect(addr1)
                .setApprovalForAll(marketplace.address, true);
        });
        it("should track newly created item,transfer nft from seller to marketplace and emit the offered event", async function () {
            await expect(
                marketplace.connect(addr1).listItem(nft.address, 1, toWei(1))
            )
                .to.emit(marketplace, "Offered")
                .withArgs(1, nft.address, 1, toWei(1), addr1.address);
            // owner of the nft now should be a marketplace
            expect(await nft.ownerOf(1)).to.equal(marketplace.address);
            // item count should be one by  now
            expect(await marketplace.itemCount()).to.equal(1);

            const item = await marketplace.items(1);
            expect(item.itemId).to.equal(1);
            expect(item.nft).to.equal(nft.address);
            expect(item.tokenId).to.equal(1);
            expect(item.price).to.equal(toWei(1));
            expect(item.sold).to.equal(false);
        });
        it("should fail if the price is set to 0", async function () {
            await expect(
                marketplace.connect(addr1).listItem(nft.address, 1, toWei(0))
            ).to.be.revertedWith("price must be greater than zero");
        });
    });
    describe("Purchasing marketplace Items", async function () {
        let price = 2;
        let fee = (feePercent / 100) * +price;
        let totalPriceInWei;
        beforeEach(async function () {
            // addr1 mints an nft
            await nft.connect(addr1).mint("sample URI");
            // addr1 approve marketplace to spend nft
            await nft
                .connect(addr1)
                .setApprovalForAll(marketplace.address, true);
            await marketplace.connect(addr1).listItem(nft.address, 1, toWei(2));
        });
        it("should update item as sold,pay seller,transfer nft to buyer,charge fees and emit a Bought event", async function () {
            const sellerAccountInitialBalance = await addr1.getBalance();
            const feeAccountInitialBalance = await deployer.getBalance();

            totalPriceInWei = await marketplace.getTotalPrice(1);
            await expect(
                marketplace
                    .connect(addr2)
                    .purchaseItem(1, { value: totalPriceInWei })
            )
                .to.emit(marketplace, "Bought")
                .withArgs(
                    1,
                    nft.address,
                    1,
                    toWei(price),
                    addr1.address,
                    addr2.address
                );
            const sellerAccountFinalBalance = await addr1.getBalance();
            const feeAccountFinalBalance = await deployer.getBalance();
            expect(+fromWei(sellerAccountFinalBalance)).to.equal(
                +price + +fromWei(sellerAccountInitialBalance)
            );

            expect(+fromWei(feeAccountFinalBalance)).to.equal(
                +fee + +fromWei(feeAccountInitialBalance)
            );
            expect(await nft.ownerOf(1)).to.equal(addr2.address);
            expect((await marketplace.items(1)).sold).to.equal(true);
        });
        it("Should fail for invalid item ids, sold items and when not enough ether is paid", async function () {
            // fails for invalid item ids
            await expect(
                marketplace
                    .connect(addr2)
                    .purchaseItem(2, { value: totalPriceInWei })
            ).to.be.revertedWith("item doesn't exists");
            await expect(
                marketplace
                    .connect(addr2)
                    .purchaseItem(0, { value: totalPriceInWei })
            ).to.be.revertedWith("item doesn't exists");
            // Fails when not enough ether is paid with the transaction.
            // In this instance, fails when buyer only sends enough ether to cover the price of the nft
            // not the additional market fee.
            await expect(
                marketplace
                    .connect(addr2)
                    .purchaseItem(1, { value: toWei(price) })
            ).to.be.revertedWith(
                "not enough ether to cover item price and market fee"
            );
            // addr2 purchases item 1
            await marketplace
                .connect(addr2)
                .purchaseItem(1, { value: totalPriceInWei });
            // addr3 tries purchasing item 1 after its been sold
            const addr3 = addrs[0];

            await expect(
                marketplace
                    .connect(addr3)
                    .purchaseItem(1, { value: totalPriceInWei })
            ).to.be.revertedWith("item already sold");
        });
    });
});
