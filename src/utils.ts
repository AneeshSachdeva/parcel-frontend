import { ethers } from 'ethers';

// Metamask injects their global api into the page via window.ethereum
declare const window: any;

const provider = new ethers.providers.Web3Provider(window.ethereum, "any");

async function requestSigner() {
    await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();
    console.log("Account:", await signer.getAddress());
    return signer;
}

// const addToken = (params: any) =>
//     window.ethereum.request({ method: 'wallet_watchAsset', params })
//         .then(() => console.log('Success, Token added!'))
//         .catch((error: Error) => console.error(`Error: ${error.message}`));

function addTokenToWallet(
    address: string,
    symbol: string,
    decimals = 18,
    image?: string
) {
    if (typeof image === 'undefined') {
        image = 'https://s2.coinmarketcap.com/static/img/coins/64x64/3701.png'
    }
    const params = {
        type: 'ERC20',
        options: {
            address,
            symbol,
            decimals,
            image
        }
    }

    window.ethereum.request({ method: 'wallet_watchAsset', params })
        .then(() => console.log('Success, Token added!'))
        .catch((error: Error) => console.log(`Error: ${error.message}`));
}

export { requestSigner, addTokenToWallet };