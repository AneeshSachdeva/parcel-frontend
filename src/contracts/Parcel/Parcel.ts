import { Contract, ethers } from 'ethers';
import { JsonRpcSigner } from '@ethersproject/providers';
import ContractArtifact from './Parcel.json';
import ERC20Artifact from '../OpenZeppelin/ERC20.json';
import ERC721Artifact from '../OpenZeppelin/ERC721.json';
import { thistle } from 'color-name';

class Parcel {
    contract: Contract;
    signer: JsonRpcSigner;

    constructor(address: string, signer: JsonRpcSigner) {
        this.signer = signer

        // Connect to deployed contract.
        this.contract = new ethers.Contract(
            address,
            ContractArtifact.abi,
            signer
        );
    }

    async addEth(amount: number) {
        const tx = await this.signer.sendTransaction({
            to: this.contract.address,
            value: ethers.utils.parseEther(`${amount}`)
        });

        return tx;
    }

    async addToken(address: string, amount: number) {
        // Connect to token through the ERC-20 ABI.
        const token = new ethers.Contract(
            address,
            ERC20Artifact.abi,
            this.signer 
        )

        // Approve the parcel to transfer tokens from the sender (this.signer)
        // to itself.
        const _amount = ethers.utils.parseEther(`${amount}`);
        await token.approve(this.contract.address, _amount);

        // Initiate transfer of tokens from sender to parcel.
        const tx = await this.contract.addTokens(
            token.address,
            _amount
        );

        return tx;
    }

    async addNft(address: string, id: number) {
        // Connect to nft contract through the ERC-721 ABI.
        const nft = new ethers.Contract(
            address,
            ERC721Artifact.abi,
            this.signer
        );

        // Initiate a safe transfer of the nft from owner (this.signer) to
        // parcel. safeTransferFrom is an overloaded function so we have to use 
        // different syntax to call it.
        const tx = await nft["safeTransferFrom(address,address,uint256)"](
            this.signer.getAddress(),  // from
            this.contract.address,     // to
            id                         // token id
        );

        return tx;
    }

    async getEthBalance() {
        const wei = await this.contract.ethBalance();

        return ethers.utils.formatEther(wei);
    }

    async getTokenBalance(address: string) {
        const tokens = await this.contract.tokenBalanceOf(address);

        return tokens;
    }

    async getNftBalance() {
        const tokens = await this.contract.balanceOfNFTs();

        return tokens;
    }
}

export default Parcel;