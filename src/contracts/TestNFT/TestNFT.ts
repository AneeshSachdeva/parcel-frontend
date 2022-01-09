import { Contract, ethers } from 'ethers';
import { JsonRpcSigner } from '@ethersproject/providers';
import ContractArtifact from './TestNFT.json';

class TestNFT {
    address = '0x45eC1Fa39E1b38e791210803D7063728F57D3722';
    symbol = 'NFT';
    decimals = 0;
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

    async mint() {
        const signerAddr = await this.signer.getAddress();
        const tx = await this.token.mint(signerAddr);
        return tx;
    }
}

export default TestNFT;





