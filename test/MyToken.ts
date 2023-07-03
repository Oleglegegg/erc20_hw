import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { BigNumber, Contract } from "ethers";
import { ethers } from "hardhat";

const DECIMALS = 18;
const NAME = "MyToken";
const SYMBOL = "MTK";
const INITIAL_AMOUNT = ethers.utils.parseEther("10"); // 10^18

const ONE_TOKEN_AMOUNT = ethers.utils.parseEther("1"); // 1^18
const TWO_TOKEN_AMOUNT = ethers.utils.parseEther("2"); // 2^18
const THREE_TOKEN_AMOUNT = ethers.utils.parseEther("3"); // 3^18
const FOUR_TOKEN_AMOUNT = ethers.utils.parseEther("4"); // 4^18
const FIVE_TOKEN_AMOUNT = ethers.utils.parseEther("5"); // 5^18
const SIX_TOKEN_AMOUNT = ethers.utils.parseEther("6"); // 5^18
const ZERO_TOKEN_AMOUNT = ethers.utils.parseEther("0"); // 0^18



// const INITIAL_AMOUNT = ethers.utils.parseUnits("1", "18"); // 10^18
// const bigNumberExample = BigNumber.from(1000);

describe("MyToken contract", function () {
  let MyToken;
  let myToken: Contract;
  let owner: SignerWithAddress, user1: SignerWithAddress, user2: SignerWithAddress, users: SignerWithAddress[];

  beforeEach(async () => {
    MyToken = await ethers.getContractFactory('MyToken');
    [owner, user1, user2, ...users] = await ethers.getSigners();
    myToken = await MyToken.deploy(NAME, SYMBOL);
  })

  describe("Initial params of contract", async () => {
    it("Should properly set Name",async () => {
      expect(await myToken.name()).eq(NAME); 
    });
    it("Should properly set Symbol",async () => {
      expect(await myToken.symbol()).eq(SYMBOL); 
    })
    it("Should properly set Decimals",async () => {
      expect(await myToken.decimals()).eq(DECIMALS); 
    })
    it("Should properly set owner",async () => {
      expect(await myToken.owner()).eq(owner.address); 
    })

    it("Should properly set totalSupply",async () => {
      expect(await myToken.totalSupply()).eq(INITIAL_AMOUNT); 
    })
    it("Should properly set owner ballance",async () => {
      expect(await myToken.balanceOf(owner.address)).eq(INITIAL_AMOUNT); 
    })

  })

  describe("Contract logic", function () {
    it("Should mint from contract owner address",async () => {
      await expect(
        await myToken.mint(owner.address, INITIAL_AMOUNT)
      ).to.emit(myToken, "Transfer")
      expect(await myToken.balanceOf(owner.address)).eq(INITIAL_AMOUNT.mul(2))
    })
    it("Should not mint to not contract owner address",async () => {
      await expect(
         myToken.connect(user1).mint(user1.address, INITIAL_AMOUNT)
      ).to.be.revertedWith( 'MyToken: you are not an owner');
      expect(await myToken.balanceOf(user1.address)).eq(0)
    })
    
    it("Should not transfer tokens if acoount out of ballance ", async function() {
      await expect(
        myToken.transfer(user1.address, ethers.utils.parseEther("10.1"))
      ).to.be.revertedWith( 'MyToken: Not enough balance');
    })
    it("Should transfer tokens from tokens owners to accounts ", async function() {
     
      // Transfer 2 token from owner to user1
      await expect(
        await myToken.transfer(user1.address, FOUR_TOKEN_AMOUNT)
      ).to.emit(myToken, "Transfer");
      expect(await myToken.balanceOf(user1.address)).eq(FOUR_TOKEN_AMOUNT);
      // Checking owner ballance
      expect(await myToken.balanceOf(owner.address)).eq(SIX_TOKEN_AMOUNT);
  
      // Transfer 1 tokens from user1 to user2
      await expect(
        await myToken.connect(user1).transfer(user2.address, ONE_TOKEN_AMOUNT)
      ).to.emit(myToken, "Transfer"); 
      expect(await myToken.balanceOf(user2.address)).eq(ONE_TOKEN_AMOUNT);
      expect(await myToken.balanceOf(user1.address)).eq(THREE_TOKEN_AMOUNT);
      
    });

    it("Should set approve and check allowance", async function() {
      await expect(
        await myToken.connect(user1).approve(user2.address, ONE_TOKEN_AMOUNT)
      ).to.emit(myToken, "Approval");
      expect(await myToken.allowance(user1.address, user2.address)).eq(ONE_TOKEN_AMOUNT);
    })

    it("Should allow do transferFrom after approve if amount is enough", async function() {
      
      await expect(
        await myToken.transfer(user1.address, FOUR_TOKEN_AMOUNT)
      ).to.emit(myToken, "Transfer");
      
      await expect(
        await myToken.connect(user1).approve(user2.address, ONE_TOKEN_AMOUNT)
      ).to.emit(myToken, "Approval");
      
      await expect(
        await myToken.connect(user2).transferFrom(user1.address, user2.address, ONE_TOKEN_AMOUNT)
      ).to.emit(myToken, "Transfer");

      expect(await myToken.balanceOf(user2.address)).eq(ONE_TOKEN_AMOUNT);
      expect(await myToken.balanceOf(user1.address)).eq(THREE_TOKEN_AMOUNT);
      expect(await myToken.balanceOf(user1.address)).eq(THREE_TOKEN_AMOUNT);
      expect(await myToken.allowance(user1.address, user2.address)).eq(ZERO_TOKEN_AMOUNT);

    })

    it("Should not allow do transferFrom after approve if amount not enough", async function() {
      
      await expect(
        await myToken.transfer(user1.address, FOUR_TOKEN_AMOUNT)
      ).to.emit(myToken, "Transfer");
      
      await expect(
        await myToken.connect(user1).approve(user2.address, ONE_TOKEN_AMOUNT)
      ).to.emit(myToken, "Approval");
      
      await expect(
        myToken.transferFrom(user1.address, user2.address, TWO_TOKEN_AMOUNT)
      ).to.be.revertedWith( 'MyToken: Insufficient allowance');

      expect(await myToken.balanceOf(user2.address)).eq(ZERO_TOKEN_AMOUNT);
      expect(await myToken.balanceOf(user1.address)).eq(FOUR_TOKEN_AMOUNT);
      expect(await myToken.allowance(user1.address, user2.address)).eq(ONE_TOKEN_AMOUNT);

    })

    it("Should not allow do burn more than amount of ballance", async function() {
      
      await expect(
        await myToken.transfer(user1.address, FOUR_TOKEN_AMOUNT)
      ).to.emit(myToken, "Transfer");
            
      await expect(
        myToken.connect(user1).burn(FIVE_TOKEN_AMOUNT)
      ).to.be.revertedWith( 'MyToken: Insufficient balance');

      expect(await myToken.balanceOf(user1.address)).eq(FOUR_TOKEN_AMOUNT);

    })

    it("Should allow do burn value less or equal amount of balance", async function() {
      
      await expect(
        await myToken.transfer(user1.address, FOUR_TOKEN_AMOUNT)
      ).to.emit(myToken, "Transfer");
            
      await expect(
        myToken.connect(user1).burn(TWO_TOKEN_AMOUNT)
      ).to.emit(myToken, "Transfer");

      expect(await myToken.balanceOf(user1.address)).eq(TWO_TOKEN_AMOUNT);
      await expect(
        myToken.connect(user1).burn(TWO_TOKEN_AMOUNT)
      ).to.emit(myToken, "Transfer");
      expect(await myToken.balanceOf(user1.address)).eq(ZERO_TOKEN_AMOUNT);
    })
  })
});