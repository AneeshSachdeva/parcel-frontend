import React, { Component } from 'react';
import { ethers } from 'ethers';
import './App.css';
import { requestSigner, addTokenToWallet } from './utils';
import ParcelFactory from './contracts/ParcelFactory/ParcelFactory';
import TestToken from './contracts/TestToken/TestToken';
import { JsonRpcSigner } from '@ethersproject/providers';

type AppProps = {};
type State = { 
  signer: JsonRpcSigner | null;
  parcelAddr: string;
};

class App extends Component<AppProps, State> {
  componentWillMount() {
    this.connectWallet();
  }

  async connectWallet() {
    const signer = await requestSigner();
    this.setState({ signer });
  }

  async createParcel() {
    const factory = new ParcelFactory(this.state.signer!);
    // TODO: randomize secret
    const parcelAddr = await factory.createParcel('test');
    this.setState({ parcelAddr });
  }

  async tokenFaucet() {
    const token = new TestToken(this.state.signer!);

    // Add token contract to metamask wallet.
    addTokenToWallet(
      token.address,
      token.symbol,
      token.decimals
    );

    // Add 420 tokens of TKN to signer's account.
    await token.faucet(ethers.utils.parseEther("420"));
  }

  constructor(props: AppProps) {
    super(props);
    this.state = { signer: null, parcelAddr: '' };
  }

  render() {
    return (
      <div className="container">
        <h1>Parcel</h1>
        <h2>Optimistic-Kovan</h2>
        <h3>1. Take test tokens from faucet</h3>
        <button onClick={async () => {
          await this.tokenFaucet();
        }}>
          ERC-20 faucet
        </button>
        <button>
          ERC-721 faucet
        </button>
        <h3>2. Create a parcel</h3>
        <button onClick={async () => {
          await this.createParcel();
        }}>
          Create parcel
        </button>
        <p>Parcel address: {this.state.parcelAddr}</p>
      </div>
    );
  }
}

export default App;