import { ethers } from 'ethers';
import ParcelFactory from './abis/ParcelFactory.json';

// Metamask injects their global api into the page via window.ethereum
declare var window: any;

const address = '0xEA69E5bDBe332311EF30F545F5f00a68Fcf608dE';
const provider = new ethers.providers.Web3Provider(window.ethereum, "any");

async function requestSigner() {
    try {
        await provider.send("eth_requestAccounts", []);
        const signer = provider.getSigner();
        console.log("Account:", await signer.getAddress());
        return signer;
    } catch (e) {
        console.error(e);
    }
}

async function createParcel(secret: string) {
    const signer = await requestSigner();

    // Connect to deployed contract.
    const factory = new ethers.Contract(address, ParcelFactory.abi, signer);
    
    // Compute hash and send transaction to create parcel.
    const hashedSecret = ethers.utils.keccak256(Buffer.from(secret));
    const tx = await factory.createParcel(hashedSecret);

    // Wait for tx to be mined and extract parcel address from the emitted
    // event.
    const { events } = await tx.wait();
    const createEvent = events.find((e: any) => e.event == "ParcelCreated");
    const parcelAddr = createEvent.args.parcel;

    return parcelAddr;
}

async function addEth(value: number) {

}

export default createParcel;