import './App.css';
import { ethers } from "ethers";
import Vector from './Vector.png'
import LoginButton from './LoginButton.png'
import Account from './Group 3Acount.png'
import React, { useState } from "react";
import { Modal } from 'react-bootstrap';
import { Button } from 'react-bootstrap';
import { Row, Container } from 'react-bootstrap';
import useLocalStorage from './Hooks/useLocalStorage'

import ERC1155 from "./contracts/ERC1155.json";
import TokenArtifact from "./contracts/GLDToken.json";
import fmmTokenArtifact from "./contracts/FunctionalMarketMaker.json";
import ConditionalTokens from "./contracts/ConditionalTokens.json";
import contractAddress from "./contracts/contract-address.json";

import {BrowserRouter as Router, Route, Switch} from 'react-router-dom'
import {Link} from 'react-router-dom'
import {useLocation} from 'react-router-dom'


import MyModal from "./components/MyModal"
import MarketBox from "./components/Marketbox"
import MarketControl from "./components/MarketControl"
import MarketGrid from "./components/MarketGrid"



//import { ConnectWallet } from "./ConnectWallet";


const HARDHAT_NETWORK_ID = '137';
const ERROR_CODE_TX_REJECTED_BY_USER = 4001;
var status =0;



export class Dapp extends React.Component {

  

  constructor(props) {
    
    super(props);
     
    // We store multiple things in Dapp's state.
    // You don't need to follow this pattern, but it's an useful example.
    this.initialState = {
      // The info of the token (i.e. It's Name and symbol)
      tokenData: undefined,
      // The user's address and balance
      selectedAddress: undefined,
      balance: 0,
      // The ID about transactions being sent, and any possible error with them
      txBeingSent: undefined,
      transactionError: undefined,
      networkError: undefined,
      show: false,
    };
    this.state = this.initialState;
  }

  
render() {

  return (
    <Router>
      <div>
        <div className="AppHeaderBar">
          <div style={{display: 'flex',  justifyContent:'center', alignItems:'center', height: '0'}}>
          
            <img src={Vector} className="AppLogo"/>
          
            <Link className="AppHeaderFont" to="/">
            MetaMarket
            </Link>
            
            <MyModal 
            connectWallet={() => this._connectWallet()}
            selectedAddress={this.state.selectedAddress}
            />
          </div>
            
              <Switch>
                <Route exact path="/">
                <div style={{display: 'flex',  justifyContent:'center', alignItems:'center', height: '15'}}>
                  <div className="Acount">
                    <span className= "lefttext">Market Balance</span>
                    <div className= "righttext">USDC Balance
                    
                      <p className= "Usdcbalance"> {(Math.floor((this.state.balance.toString()/1e4)))/100 } </p>
                    
                    
                    </div>
                    <span className= "seperatingline"> </span>
                    
                  </div>
                </div>

           
                <span style={{display: 'flex',  justifyContent:'center',  height: '15'}}>
                <MarketBox
                />
                </span>
              </Route>
            
              
              <Route path="/Market">
            
                
                <div style={{display: 'flex',  justifyContent:'center', alignItems:'center', height: '15'}}>
                  <MarketControl
                  await checkyesprice={(marketaddress, outcomeIndex, investmentAmount) => 
                  this._checkyesprice(marketaddress, outcomeIndex, investmentAmount)}
                  provider={this._provider}
                  AcountUSDC={this.state.balance}
                  await getCollectionId ={(conditionId, indexSet) => this._getCollectionID(conditionId, indexSet)}
                  await transferTokensApprove ={(marketaddress, amount, index) => this._transferTokensApprove(marketaddress, amount, index)}
                  await sellTokensApprove ={(marketaddress, amount, index) => this._sellTokensApprove(marketaddress, amount, index)}
                  />
                </div>
              </Route>
            </Switch>
          
          
        </div>

      </div>
    </Router>
  );

  if (status === 1) {
      console.log('helloworld!');
    }
  
}
  

  async _connectWallet() {
    // This method is run when the user clicks the Connect. It connects the
    // dapp to the user's wallet, and initializes it.

    // To connect to the user's wallet, we have to run this method.
    // It returns a promise that will resolve to the user's address.
    const [selectedAddress] = await window.ethereum.enable();

    // Once we have the address, we can initialize the application.

    // First we check the network
    if (!this._checkNetwork()) {
      return;
    }

    this._initialize(selectedAddress);

    // We reinitialize it whenever the user changes their account.
    window.ethereum.on("accountsChanged", ([newAddress]) => {
      this._stopPollingData();
      // `accountsChanged` event can be triggered with an undefined newAddress.
      // This happens when the user removes the Dapp from the "Connected
      // list of sites allowed access to your addresses" (Metamask > Settings > Connections)
      // To avoid errors, we reset the dapp state 
      if (newAddress === undefined) {
        return this._resetState();
      }
      
      this._initialize(newAddress);
      
    });
    
    // We reset the dapp state if the network is changed
    window.ethereum.on("networkChanged", ([networkId]) => {
      this._stopPollingData();
      this._resetState();
    });
  }

  // This method checks if Metamask selected network is Localhost:8545 
 _checkNetwork() {
    if (window.ethereum.networkVersion === HARDHAT_NETWORK_ID) {
      return true;
    }

    this.setState({ 
      networkError: 'Please connect Metamask to Matic Netwrok'
    });

    return false;
  }
  
  _initialize(userAddress) {
    // This method initializes the dapp

    // We first store the user's address in the component's state
    this.setState({
      selectedAddress: userAddress,
  });

    // Then, we initialize ethers, fetch the token's data, and start polling
    // for the user's balance.

    // Fetching the token data and the user's balance are specific to this
    // sample project, but you can reuse the same initialization pattern.

    this._intializeEthers();
    this._getTokenData();
    this._startPollingData();
  }
  _stopPollingData() {
    clearInterval(this._pollDataInterval);
    this._pollDataInterval = undefined;
  }

  _startPollingData() {
    this._pollDataInterval = setInterval(() => this._updateBalance(), 10000000);

    // We run it once immediately so we don't have to wait for it
    this._updateBalance();
  }

  _resetState() {
    this.setState(this.initialState);
  }

  async _updateBalance() {
    const balance = await this._token.balanceOf(this.state.selectedAddress);
    this.setState({ balance });
  }


  async _checknoprice( ){

  }

  async _getTokenData() {
    const name = await this._token.name();
    const symbol = await this._token.symbol();

    this.setState({ tokenData: { name, symbol } });
  }

    async _intializeEthers() {
    // We first initialize ethers by creating a provider using window.ethereum
    this._provider = new ethers.providers.Web3Provider(window.ethereum);


    // When, we initialize the contract using that provider and the token's
    // artifact. You can do this same thing with your contracts.
    this._token = new ethers.Contract(
      contractAddress.Token,
      TokenArtifact.abi,
      this._provider.getSigner(0)
    );

  
    }


    async _checkyesprice(marketaddress, outcomeIndex, investmentAmount) {
    // We first initialize ethers by creating a provider using window.ethereum
    this._provider = new ethers.providers.Web3Provider(window.ethereum);

    
    this._functionalmarketmaker = new ethers.Contract(
      marketaddress,
      fmmTokenArtifact.abi,
      this._provider.getSigner(0)


    );

    const yesprice = await this._functionalmarketmaker.calcBuyAmount(1000000,1);
    return yesprice;

  
    }

       async _getCollectionID(conditionId, indexSet) {
    // We first initialize ethers by creating a provider using window.ethereum
    this._provider = new ethers.providers.Web3Provider(window.ethereum);

    this._ConditionalToken = new ethers.Contract(
      '0x4D97DCd97eC945f40cF65F87097ACe5EA0476045',
      ConditionalTokens.abi,
      this._provider.getSigner(0)
      

    );

    const CollectionID = await this._ConditionalToken.getCollectionId('0x0000000000000000000000000000000000000000000000000000000000000000',conditionId,indexSet);
      
      

      const PositionID = await this._ConditionalToken.getPositionId(contractAddress.Token,CollectionID);
      

      const balance = await this._ConditionalToken.balanceOf(this.state.selectedAddress,PositionID);
      return balance; 
   }

async _transferTokensApprove(marketaddress, amount, index) {
    // Sending a transaction is a complex operation:
    //   - The user can reject it
    //   - It can fail before reaching the ethereum network (i.e. if the user
    //     doesn't have ETH for paying for the tx's gas)
    //   - It has to be mined, so it isn't immediately confirmed.
    //     Note that some testing networks, like Hardhat Network, do mine
    //     transactions immediately, but your dapp should be prepared for
    //     other networks.
    //   - It can fail once mined.
    //
    // This method handles all of those things, so keep reading to learn how to
    // do it.
    var allowance = await this._token.allowance(this.state.selectedAddress, marketaddress);
    console.log(allowance)

    if (allowance< amount) {
      try {
        this._dismissTransactionError();
  
        // We send the transaction, and save its hash in the Dapp's state. This
        // way we can indicate that we are waiting for it to be mined.
        
      
        const tx = await this._token.approve(marketaddress, amount);
        this.setState({ txBeingSent: tx.hash });
  
        // We use .wait() to wait for the transaction to be mined. This method
        // returns the transaction's receipt.
        // eslint-disable-next-line
        const receipt = await tx.wait();
  
  
          } catch (error) {
            // We check the error code to see if this error was produced because the
            // user rejected a tx. If that's the case, we do nothing.
            if (error.code === ERROR_CODE_TX_REJECTED_BY_USER) {
              return;
            }
      
            // Other errors are logged and stored in the Dapp's state. This is used to
            // show them to the user, and for debugging.
            console.error(error);
            this.setState({ transactionError: error });
          } finally {
            // If we leave the try/catch, we aren't sending a tx anymore, so we clear
            // this part of the state.
            this.setState({ txBeingSent: undefined });
          }   
      }


      this._transferTokens(marketaddress, amount, index);
    }

  async _transferTokens(marketaddress, amount, index) {
        try {
      // If a transactiError sending transactionon fails, we save that error in the component's state.
      // We only save one such error, so before sending a second transaction, we
      // clear it.
      

      // We send the transaction, and save its hash in the Dapp's state. This
      // way we can indicate that we are waiting for it to be mined.
      const tx = await this._functionalmarketmaker.buy(amount, index,0);
      this.setState({ txBeingSent: tx.hash });

      // We use .wait() to wait for the transaction to be mined. This method
      // returns the transaction's receipt.
      const receipt = await tx.wait();

      // The receipt, contains a status flag, which is 0 to indicate an error.
      if (receipt.status === 0) {
        // We can't know the exact error that make the transaction fail once it
        // was mined, so we throw this generic one.
        throw new Error("Transaction failed");
      }

      // If we got here, the transaction was successful, so you may want to
      // update your state. Here, we update the user's balance.
      await this._updateBalance();
    } catch (error) {
      // We check the error code to see if this error was produced because the
      // user rejected a tx. If that's the case, we do nothing.
      if (error.code === ERROR_CODE_TX_REJECTED_BY_USER) {
        return;
      }

      // Other errors are logged and stored in the Dapp's state. This is used to
      // show them to the user, and for debugging.
      console.error(error);
      this.setState({ transactionError: error });
    } finally {
      // If we leave the try/catch, we aren't sending a tx anymore, so we clear
      // this part of the state.
      this.setState({ txBeingSent: undefined });
    } 
  }

  _dismissTransactionError() {
    this.setState({ transactionError: undefined });
  }

async _sellTokensApprove(marketaddress, amount, index) {
    // Sending a transaction is a complex operation:
    //   - The user can reject it
    //   - It can fail before reaching the ethereum network (i.e. if the user
    //     doesn't have ETH for paying for the tx's gas)
    //   - It has to be mined, so it isn't immediately confirmed.
    //     Note that some testing networks, like Hardhat Network, do mine
    //     transactions immediately, but your dapp should be prepared for
    //     other networks.
    //   - It can fail once mined.
    //
    // This method handles all of those things, so keep reading to learn how to
    // do it.
    var approval = await this._ConditionalToken.isApprovedForAll(this.state.selectedAddress, marketaddress);

    if (approval == false) {
      try {
        this._dismissTransactionError();
  
        // We send the transaction, and save its hash in the Dapp's state. This
        // way we can indicate that we are waiting for it to be mined.
        
      
        const tx = await this._ConditionalToken.setApprovalForAll(marketaddress, true);
        this.setState({ txBeingSent: tx.hash });
  
        // We use .wait() to wait for the transaction to be mined. This method
        // returns the transaction's receipt.
        // eslint-disable-next-line
        const receipt = await tx.wait();
  
  
          } catch (error) {
            // We check the error code to see if this error was produced because the
            // user rejected a tx. If that's the case, we do nothing.
            if (error.code === ERROR_CODE_TX_REJECTED_BY_USER) {
              return;
            }
      
            // Other errors are logged and stored in the Dapp's state. This is used to
            // show them to the user, and for debugging.
            console.error(error);
            this.setState({ transactionError: error });
          } finally {
            // If we leave the try/catch, we aren't sending a tx anymore, so we clear
            // this part of the state.
            this.setState({ txBeingSent: undefined });
          }   
      }


      this._sellTokens(marketaddress, amount, index);
    }

  async _sellTokens(marketaddress, amount, index) {
        try {
      // If a transactiError sending transactionon fails, we save that error in the component's state.
      // We only save one such error, so before sending a second transaction, we
      // clear it.
      

      // We send the transaction, and save its hash in the Dapp's state. This
      // way we can indicate that we are waiting for it to be mined.
      const tx = await this._functionalmarketmaker.sell(0, index,amount);
      this.setState({ txBeingSent: tx.hash });

      // We use .wait() to wait for the transaction to be mined. This method
      // returns the transaction's receipt.
      const receipt = await tx.wait();

      // The receipt, contains a status flag, which is 0 to indicate an error.
      if (receipt.status === 0) {
        // We can't know the exact error that make the transaction fail once it
        // was mined, so we throw this generic one.
        throw new Error("Transaction failed");
      }

      // If we got here, the transaction was successful, so you may want to
      // update your state. Here, we update the user's balance.
      await this._updateBalance();
    } catch (error) {
      // We check the error code to see if this error was produced because the
      // user rejected a tx. If that's the case, we do nothing.
      if (error.code === ERROR_CODE_TX_REJECTED_BY_USER) {
        return;
      }

      // Other errors are logged and stored in the Dapp's state. This is used to
      // show them to the user, and for debugging.
      console.error(error);
      this.setState({ transactionError: error });
    } finally {
      // If we leave the try/catch, we aren't sending a tx anymore, so we clear
      // this part of the state.
      this.setState({ txBeingSent: undefined });
    } 
  }

async _getPoolBalance(marketaddress) {
  let poolBalances = new Array();
  poolBalances[0] = await this._ConditionalToken.balanceOf(marketaddress, 0);
  poolBalances[1] = await this._ConditionalToken.balanceOf(marketaddress, 1);
  return poolBalances;

}




    

 
}