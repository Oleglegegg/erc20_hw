import { task } from 'hardhat/config'
import { BigNumber, ContractTransaction, ContractReceipt } from "ethers";
import { Address } from 'cluster';

task('transferFrom', 'transferFrom tokens')
    .addParam('token', 'Token address')
    .addParam('from', 'From user address')
    .addParam('to', 'To user address')
    .addParam('amount', 'Amount to send')
	.setAction(async ({ token, from, to, amount}, { ethers }) => {
        const Token = await ethers.getContractFactory('MyToken')
        const tokenContract = Token.attach(token)


        const contractTx: ContractTransaction = await tokenContract.transferFrom(from, to, amount);
        const contractReceipt: ContractReceipt = await contractTx.wait();
        const event = contractReceipt.events?.find(event => event.event === 'Transfer');
        const eFrom: Address = event?.args!['from'];
        const eTo: Address = event?.args!['to'];
        const eAmount: BigNumber = event?.args!['value'];            
    	console.log(`From: ${eFrom}`)
    	console.log(`To: ${eTo}`)
    	console.log(`Value: ${eAmount}`)
    })
