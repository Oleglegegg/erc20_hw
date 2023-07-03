import { task } from 'hardhat/config'
import { BigNumber, ContractTransaction, ContractReceipt } from "ethers";
import { Address } from 'cluster';

task('approve', 'Approve tokens to spender')
    .addParam('token', 'Token address')
    .addParam('spender', 'Spender user address')
    .addParam('value', 'Value to send')
	.setAction(async ({ token, spender, value}, { ethers }) => {
        if (!ethers.utils.isAddress(token)) {
            console.error('Invalid token address')  // проверяем на валидность адреса 
            return
        }
        if (!ethers.utils.isAddress(spender)) {
            console.error('Invalid spender address')
            return
        }
        const parsedValue = ethers.utils.parseUnits(value, 'ether')  // переводим в целое значение


        const Token = await ethers.getContractFactory('MyToken')
        const tokenContract = Token.attach(token)

        try {
        const contractTx: ContractTransaction = await tokenContract.approve(spender, parsedValue);
        const contractReceipt: ContractReceipt = await contractTx.wait();
        const event = contractReceipt.events?.find(event => event.event === 'Approval');
        const eOwner: Address = event?.args!['owner'];
        const eSpender: Address = event?.args!['spender'];
        const eValue: BigNumber = event?.args!['value'];            
    	console.log(`Owner: ${eOwner}`)
    	console.log(`Spender: ${eSpender}`)
    	console.log(`Value: ${eValue}`)
    } catch (error) {
        console.error('An error occurred:', error)
    }
    })
