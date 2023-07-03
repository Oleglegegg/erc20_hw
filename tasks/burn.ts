import { task } from 'hardhat/config'
import { BigNumber, ContractTransaction, ContractReceipt } from "ethers";
import { Address } from 'cluster';

task('burn', 'burn tokens')
    .addParam('token', 'Token address')
    .addParam('amount', 'Amount to send')
	.setAction(async ({ token, amount}, { ethers }) => {
        const Token = await ethers.getContractFactory('MyToken')
        const tokenContract = Token.attach(token)


        const contractTx: ContractTransaction = await tokenContract.burn(amount);
        const contractReceipt: ContractReceipt = await contractTx.wait();
        const event = contractReceipt.events?.find(event => event.event === 'Transfer');
        const eFrom: Address = event?.args!['from'];
        const eTo: Address = event?.args!['to'];
        const eAmount: BigNumber = event?.args!['amount'];            
    	console.log(`From: ${eFrom}`)
    	console.log(`To: ${eTo}`)
    	console.log(`Value: ${eAmount}`)
    })

