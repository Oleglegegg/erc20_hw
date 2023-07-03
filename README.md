# Erc20 Token Example

## Installation
Clone the repository using the following command:
Install the dependencies using the following command:
```
npm i
```

## Deployment

Fill in all the required environment variables(copy .env-example to .env and fill it). 

Deploy contract to the chain (mumbai testnet):
```
npx hardhat run scripts/deploy.ts --network polygon-mumbai
```

## Tasks
Create new task(s) ans save it(them) in the folder "tasks". Add a new task name in the file "tasks/index.ts".

Running a task:
```
npx hardhat mint --user {USER_ADDRESS} --amount 1230000000000000000 --token {TOKEN_ADDRESS} --network polygon-mumbai
```
Note: Replace {USER_ADDRESS} with the address of the wallet and  {TOKEN_ADDRESS} with the address of the token.

## Verification
Verify the installation by running the following command:
```
npx hardhat verify --network polygon-mumbai {TOKEN_ADDRESS} "MyToken" "MTK"
```
Note: Replace {TOKEN_ADDRESS} with the address of the token, "MyToken" with the name of the token and "MTK" with the symbol of the token.