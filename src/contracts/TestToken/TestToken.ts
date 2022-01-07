import { BigNumber, Contract, ethers } from 'ethers';
import { JsonRpcSigner } from '@ethersproject/providers';
import ContractArtifact from './TestToken.json';

class TestToken {
    address = '0x26c2dED1DF1728174d44990798a15A72F8F11871';
    symbol = 'TKN';
    decimals = 18;
    token: Contract;
    signer: JsonRpcSigner;

    constructor(signer: JsonRpcSigner) {
        // Connect to deployed contract.
        this.token = new ethers.Contract(
            this.address,
            ContractArtifact.abi,
            signer
        );

        this.signer = signer;
    }

    async faucet(amount: BigNumber) {
        const signerAddr = await this.signer.getAddress();
        await this.token.faucet(signerAddr, amount);
    }
}

export default TestToken;