import { Contract, ethers } from 'ethers';
import { JsonRpcSigner } from '@ethersproject/providers';
import ContractArtifact from './ParcelFactory.json';

class ParcelFactory {
    address = '0xEA69E5bDBe332311EF30F545F5f00a68Fcf608dE';
    factory: Contract;

    constructor(signer: JsonRpcSigner) {
        // Connect to deployed contract.
        this.factory = new ethers.Contract(
            this.address,
            ContractArtifact.abi,
            signer
        );
    }

    async createParcel(secret: string) {
        // Compute hash and send transaction to create parcel.
        const hashedSecret = ethers.utils.keccak256(Buffer.from(secret));
        const tx = await this.factory.createParcel(hashedSecret);

        // Wait for tx to be mined and extract parcel address from the emitted
        // event.
        const { events } = await tx.wait();
        const createEvent = events.find((e: any) => e.event == "ParcelCreated");
        const parcelAddr = createEvent.args.parcel;

        return parcelAddr;
    }
}

export default ParcelFactory;