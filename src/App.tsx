import React, { Component } from 'react';
import NumericInput from 'react-numeric-input';
import { ethers } from 'ethers';
import './App.css';
import { requestSigner, addTokenToWallet } from './utils';
import Parcel from './contracts/Parcel/Parcel';
import TestToken from './contracts/TestToken/TestToken';
import TestNFT from './contracts/TestNFT/TestNFT';
import { JsonRpcSigner } from '@ethersproject/providers';

type AppProps = {};
type State = { 
  signer: JsonRpcSigner | null;
  parcel: Parcel | null;
  parcelAddrInput: string;
  mintTxHash: string;
  ethAmtInput: number;
  sendEthTxHash: string;
  tokenAddrInput: string;
  tokenAmtInput: number;
  nftAddrInput: string;
  nftIdInput: number;
  sendTokenTxHash: string;
  sendNftTxHash: string;
};

const etherscanUrl = 'https://kovan-optimistic.etherscan.io';

class App extends Component<AppProps, State> {
  componentWillMount() {
    this.connectWallet();
  }

  async connectWallet() {
    const signer = await requestSigner();
    this.setState({ signer });
  }

  async createParcel() {
    // const factory = new ParcelFactory(this.state.signer!);
    // // TODO: randomize secret
    // const parcelAddr = await factory.createParcel('test');
    const parcelAddr = '0x4e8D8B4F9962cA4bd3afC7D95404c4d407Ee1A70';
    const parcel = new Parcel(parcelAddr, this.state.signer!);
    this.setState({ parcel });
  }

  async connectToParcel() {
    const parcel = new Parcel(this.state.parcelAddrInput, this.state.signer!);
    this.setState({ parcel });
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

  async nftFaucet() {
    const nft = new TestNFT(this.state.signer!);

    // Mint NFT to signer's account.
    const tx = await nft.mint();
    this.setState({ mintTxHash: tx.hash });
  }

  async addEthToParcel(amount: number) {
    const tx = await this.state.parcel!.addEth(amount);
    this.setState({ sendEthTxHash: tx.hash });
  }

  async addTokenToParcel(address: string, amount: number) {
    const tx = await this.state.parcel!.addToken(address, amount);
    this.setState({ sendTokenTxHash: tx.hash });
  }

  async addNftToParcel(address: string, id: number) {
    const tx = await this.state.parcel!.addNft(address, id);
    this.setState({ sendNftTxHash: tx.hash });
  }

  constructor(props: AppProps) {
    super(props);
    this.state = {
      signer: null,
      parcel: null,
      parcelAddrInput: '',
      mintTxHash: '',
      ethAmtInput: 0 ,
      sendEthTxHash: '',
      tokenAddrInput: '',
      tokenAmtInput: 0,
      nftAddrInput: '',
      nftIdInput: 0,
      sendTokenTxHash: '',
      sendNftTxHash: ''
    };

    //this.handleParcelAddrChange = this.handleParcelAddrChange.bind(this);
    this.handleAddEthChange = this.handleAddEthChange.bind(this);
    this.handleAddTokenAddrChange = this.handleAddTokenAddrChange.bind(this);
    this.handleAddTokenAmtChange = this.handleAddTokenAmtChange.bind(this);
    this.handleAddNftAddrChange = this.handleAddNftAddrChange.bind(this);
    this.handleAddNftIdChange = this.handleAddNftIdChange.bind(this);
  }

  handleAddEthChange(
    amount: number | null,
    strAmount: string,
    input: HTMLInputElement
  ) {
    this.setState({ ethAmtInput: amount! });
  }

  handleAddTokenAddrChange(event: React.ChangeEvent<HTMLInputElement>) {
    this.setState({ tokenAddrInput: event.target.value });
  }

  handleAddTokenAmtChange(
    amount: number | null,
    strAmount: string,
    input: HTMLInputElement
  ) {
    this.setState({ tokenAmtInput: amount! });
  }

  handleAddNftAddrChange(event: React.ChangeEvent<HTMLInputElement>) {
    this.setState({ nftAddrInput: event.target.value });
  }

  handleAddNftIdChange(
    amount: number | null,
    strAmount: string,
    input: HTMLInputElement
  ) {
    this.setState({ nftIdInput: amount! });
  }

  handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();  // Prevents form from reloading page.
  }

  render() {
    let mintTxLink = <a></a>;
    if (this.state.mintTxHash != '') {
      const link = `${etherscanUrl}/tx/${this.state.mintTxHash}`
      mintTxLink = <a href={link} target="_blank">View your mint on etherscan</a>
    }

    let parcelAddrLink = <a></a>;
    if (this.state.parcel != null) {
      const link = `${etherscanUrl}/address/${this.state.parcel.contract.address}`
      parcelAddrLink = <a href={link} target="_blank">View your parcel on etherscan</a>
    }

    let addEthTxLink = <a></a>;
    if (this.state.sendEthTxHash != '') {
      const link = `${etherscanUrl}/tx/${this.state.sendEthTxHash}`
      addEthTxLink = <a href={link} target="_blank">View transaction on etherscan</a>
    }

    let addTokenTxLink = <a></a>;
    if (this.state.sendTokenTxHash != '') {
      const link = `${etherscanUrl}/tx/${this.state.sendTokenTxHash}`
      addTokenTxLink = <a href={link} target="_blank">View transaction on etherscan</a>
    }

    let addNftTxLink = <a></a>;
    if (this.state.sendNftTxHash != '') {
      const link = `${etherscanUrl}/tx/${this.state.sendNftTxHash}`
      addNftTxLink = <a href={link} target="_blank">View transaction on etherscan</a>
    }

    return (
      <div className="container">
        <h1>Parcel</h1>
        <h2>Optimistic-Kovan</h2>

        <h3>1. Take test tokens from faucet</h3>

        <p>
          <button onClick={() => {
            window.open("https://faucet.paradigm.xyz/", "_blank");
          }}>
            ETH faucet
          </button>
        </p>
        <p>
          <button onClick={async () => {
            await this.tokenFaucet();
          }}>
            ERC-20 faucet
          </button>
        </p>
        <p>
          <button onClick={async () => {
            await this.nftFaucet();
          }}>
            ERC-721 faucet
          </button>
        </p>
        {mintTxLink}

        <h3>2. Create a parcel</h3>

        <p>
          <button onClick={async () => {
            await this.createParcel();
          }}>
            Create parcel
          </button>
        </p>
        <p>
          {parcelAddrLink}
        </p>

        <h3>3. Stuff parcel</h3>

        <h4>Add ETH</h4>
        <form onSubmit={this.handleSubmit}>
          <label>
            <NumericInput 
              value={this.state.ethAmtInput}
              min={0}
              precision={18}
              onChange={this.handleAddEthChange} 
            />
          </label>
          <button onClick={async () => {
            await this.addEthToParcel(this.state.ethAmtInput);
          }}>
            Add ETH
          </button>
          <p>
            {addEthTxLink}
          </p>
        </form>
        
        <h4>Add ERC-20 Token</h4>
        <form onSubmit={this.handleSubmit}>
          <p>
            Token:
            <input
              type="text"
              placeholder='contract address'
              onChange={this.handleAddTokenAddrChange}
            />
          </p>
          <p>
            Amount:
            <NumericInput
              value={this.state.tokenAmtInput}
              min={0}
              precision={18}
              onChange={this.handleAddTokenAmtChange}
            />
          </p>
          <p>
            <button onClick={async () => {
              await this.addTokenToParcel(
                this.state.tokenAddrInput,
                this.state.tokenAmtInput
              );
            }}>
              Add ERC-20
            </button>
          </p>
          <p>
            {addTokenTxLink}
          </p>
        </form>

        <h4>Add ERC-721 Token</h4>
        <form onSubmit={this.handleSubmit}>
          <p>
            NFT:
            <input
              type="text"
              placeholder='contract address'
              onChange={this.handleAddNftAddrChange}
            />
          </p>
          <p>
            ID:
            <NumericInput
              value={this.state.nftIdInput}
              min={0}
              precision={0}
              onChange={this.handleAddNftIdChange}
            />
          </p>
          <p>
            <button onClick={async () => {
              await this.addNftToParcel(
                this.state.nftAddrInput,
                this.state.nftIdInput
              );
            }}>
              Add ERC-721
            </button>
          </p>
          <p>
            {addNftTxLink}
          </p>
        </form>
      </div>
    );
  }
}

export default App;