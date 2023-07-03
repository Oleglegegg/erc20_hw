import { task } from 'hardhat/config'
import { BigNumber, ContractTransaction, ContractReceipt } from "ethers";
import { Address } from 'cluster';

task('transfer', 'Transfer tokens to the address')
    .addParam('token', 'Token address')
    .addParam('to', 'Receiver user address')
    .addParam('amount', 'Token amount')
	.setAction(async ({ token, to, amount}, { ethers }) => {
        const Token = await ethers.getContractFactory('MyToken')
        const tokenContract = Token.attach(token)


        const contractTx: ContractTransaction = await tokenContract.transfer(to, amount);
        const contractReceipt: ContractReceipt = await contractTx.wait();
        const event = contractReceipt.events?.find(event => event.event === 'Transfer');
        const eInitiator: Address = event?.args!['from'];
        const eRecipient: Address = event?.args!['to'];
        const eAmount: BigNumber = event?.args!['value'];            
    	console.log(`Message sender: ${eInitiator}`)
    	console.log(`to: ${eRecipient}`)
    	console.log(`Amount: ${eAmount}`)
    })
