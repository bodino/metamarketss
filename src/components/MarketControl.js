import React, { useState, useEffect } from 'react'
import { useLocation } from "react-router-dom"
import { Tabs } from 'react-bootstrap';
import { Tab } from 'react-bootstrap';
import { Nav } from 'react-bootstrap';
import { Col } from 'react-bootstrap';
import {Row} from 'react-bootstrap';
import fmmTokenArtifact from "../contracts/FunctionalMarketMaker.json"
import '../App.css';
import BackButton from '../BackButton.jpg';
import {Link} from 'react-router-dom';
import {Form} from 'react-bootstrap';
import { ethers } from "ethers";
import { BigNumber, BigNumberish } from "@ethersproject/bignumber";
import { newtonRaphson } from "newton-raphson-method";
import Big from "big.js";








const MarketBox = ({props,checkyesprice,provider,AcountUSDC,getCollectionId,transferTokensApprove,sellTokensApprove}) => {
    const location = useLocation()
    const item = location.state.fromDashboard;
    const marketid = item.marketMakerAddress;
    const marketconditionid = item.conditionId;
  
    const price= checkyesprice(marketid,0,0);
   
    var sharebalanceno = 0;
    var sharebalanceyes = 0;


    const calcSellAmountInCollateral = async () => {
    Big.DP = 90;

    const holdings = poolBalances[outcomeIndex];
    const otherHoldings = poolBalances.filter((_, i) => outcomeIndex !== i);

    const sharesToSellBig = new Big(sharesToSell.toString());
    const holdingsBig = new Big(holdings.toString());
    const otherHoldingsBig = otherHoldings.map(x => new Big(x.toString()));

    const f = (r: Big): Big => {
        // For three outcomes, where the first outcome is the one being sold, the formula is:
        // f(r) = ((y - R) * (z - R)) * (x  + a - R) - x*y*z
        // where:
        //   `R` is r / (1 - fee)
        //   `x`, `y`, `z` are the market maker holdings for each outcome
        //   `a` is the amount of outcomes that are being sold
        //   `r` (the unknown) is the amount of collateral that will be returned in exchange of `a` tokens
        const R = r.div(1 - fee);
        const firstTerm = otherHoldingsBig.map(h => h.minus(R)).reduce((a, b) => a.mul(b));
        const secondTerm = holdingsBig.plus(sharesToSellBig).minus(R);
        const thirdTerm = otherHoldingsBig.reduce((a, b) => a.mul(b), holdingsBig);
        return firstTerm.mul(secondTerm).minus(thirdTerm);
    };

    const r = newtonRaphson(f, 0, { maxIterations: 100 });

    if (r) {
        const amountToSell = BigNumber.from(r.toFixed(0));
        return amountToSell;
  }


    }



    const [yesbalance, setyesBalance] = useState(0);
    const [nobalance, setnoBalance] = useState(0);
    const [StateofRadio, Setradiostate] = useState(undefined);
    console.log(StateofRadio);
     const [show, setShow] = useState(true);
    const [css, setcss] = useState("Buybutton");

    const style = {backgroundColor: "#FFAD33", border: "0.5px solid #C6C6C6"}

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    let [showBuyBox, setShowBuyBox] = useState(true);
    const [showSellBox, setShowSellBox] = useState(false);

    const _closeBuyBox = () => setShowBuyBox(false);
    const _showBuyBox = () => setShowBuyBox(true);
    const _closeSellBox = () => setShowSellBox(false);
    const _showSellBox = () => setShowSellBox(true);


    
    // if (show == false) {
    // setcss("Sellbutton");
    // }

    const printsharebalance = async () => {
          sharebalanceyes = await getCollectionId(marketconditionid,1);
          sharebalanceno = await getCollectionId(marketconditionid,2);
          sharebalanceno = (parseInt(sharebalanceno._hex, 16))/1e6;
          sharebalanceyes = (parseInt(sharebalanceyes._hex, 16))/1e6;
        setnoBalance(sharebalanceno);
        setyesBalance(sharebalanceyes);
        };
    printsharebalance();
     




// function changeValue() {
// document.getElementById('bodo1').value = 12;
// }

const formData = new FormData();
   




  return (








    <div>

        <form onSubmit={(event) => {
          // This function just calls the transferTokens callback with the
          // form's data.
          event.preventDefault();

          const formData = new FormData(event.target);
          const to = formData.get("formHorizontalRadios1");
          var amount = formData.get("amount");
          amount = amount*1e6;

          console.log(showBuyBox)
          if (showBuyBox == true){
            transferTokensApprove(marketid, amount, StateofRadio);
            console.log("1")
          }
          else if (showBuyBox == false){
              
              sellTokensApprove(marketid, amount, StateofRadio);
              console.log("2")
          }
        }}
        >



         
        <div className="marketscreentitle"> 
            <div className="marketscreenbox"> </div>
            <div className ="marketscreentexttitle">{item.question}</div>
        
        </div>
            <Link className="MarketBoxText"  to="/" >
            <img src={BackButton} className="backbuttonmaster" />
            </Link>

        <div className="leftinfobox">
           

            <span className="leftrectangle">
            </span>
            <div className="screenseperator1">
            </div>
            <div className="screenseperator2">
            </div>

             <header className="liquidityheader">Liqudity
                < p className="liquiditytext">{Math.round(item.liquidity)}
                </p>
            </header>

            


            <header className="totalvolumeheader">Total Volume
                <p className="liquiditytext">{Math.round(item.volume)}
                </p>
            </header>

            

            <header className="closingdateheader">Closing Date
                <p className="closingdatetext">{item.end_date}
                </p>
            </header> 

            
        
        </div>

        <div className="rightinfobox">
              <span onClick={() => {handleShow(); _showBuyBox(); }} className="Buybutton" style={show ? style : null}>

                <p className="buttontext" > Buy </p>
           
            </span>
            <span onClick={() => {handleClose(); _closeBuyBox(); }} className="Sellbutton" style={show ? null : style}>
                <p className="buttontext" > Sell </p> 
            
         
            </span>
        </div>

    {showBuyBox ? 
    <div className="buysellbox" >
            <div className="marketboxseperatingline">
            </div>
        
            <div className="marketboxseperatingline2">
            </div>

            <div className="firstcircle">
                <p className="YourUSDC">USDC Balance
                </p>
                
                <p className="YourUSDCseperator">
                </p>

                <p className="USDCbalance">{(Math.floor((AcountUSDC.toString()/1e4)))/100}
                </p>
                
            </div>

            <div className="secondcircle">
            

                <p onClick={console.log("bi")} className="Max"> Max
                </p>

                <p className="Maxseperator">
                </p>

                <div  className="form-group">
                        <input
                        id="bodo1"
                     className="form"
                     type="number"
                    
                        step="1"
                        name="amount"
                        placeholder="100"
                        
                        required
                        />

                </div>
            </div>

            <div className="executetradebox">
                <input className="btn btn-primary, executetradeboxtext" type="submit" value="Execute Trade" />
                
            </div>

            <div className="thirdcircle">
            </div>

            <div className="yesnoseperator">
            </div>
            
            <p className="outcometext">Outcome
            </p>

            <p className="pricetext">Price
                <p className="yesprice">{Math.round(item.outcomePrices[0]*100)/100}
                </p>
                <p className="noprice">{Math.round(item.outcomePrices[1]*100)/100}
                </p>
            </p>

            <p className="mysharestext">My Shares
                <p className="yesprice"> {yesbalance}
                </p>
                 <p className="noprice"> {nobalance}
                </p>
            </p>

            <fieldset>
                <Form.Group as={Row} className="yesnospacing">
                <Col >
                    <Form.Check onClick={() => {Setradiostate(0)}}
                    type="radio"
                    label="Yes"
                    name="formHorizontalRadios"
                    id="formHorizontalRadios1"
                    required
                    />
                    <Form.Check onClick={() => {Setradiostate(1)}}
                    type="radio"
                    label="No"
                    name="formHorizontalRadios"
                    id="formHorizontalRadios2"
                    required
                    />
                </Col>
                </Form.Group>
            </fieldset>
            
        </div> 
        : <div className="buysellbox" >
            <div className="marketboxseperatingline">
            </div>
        
            <div className="marketboxseperatingline2">
            </div>

            <div className="firstcircle">
                <p className="YourUSDC">USDC Balance
                </p>
                
                <p className="YourUSDCseperator">
                </p>

                <p className="USDCbalance">{(Math.floor((AcountUSDC.toString()/1e4)))/100}
                </p>
                
            </div>

            <div className="secondcircle">
            

                <p onClick={console.log("bi")} className="Max"> Max
                </p>

                <p className="Maxseperator">
                </p>

                <div  className="form-group">
                        <input
                        id="bodo1"
                     className="form"
                     type="number"
                    
                        step="0.0000001"
                        name="amount"
                        placeholder="100"
                        
                        required
                        />

                </div>
            </div>

            <div className="executetradebox">
                <input className="btn btn-primary, executetradeboxtext" type="submit" value="Execute Trade" />
                
            </div>

            <div className="thirdcircle">
            </div>

            <div className="yesnoseperator">
            </div>
            
            <p className="outcometext">Outcome
            </p>

            <p className="pricetext">Price
                <p className="yesprice">{Math.round(item.outcomePrices[0]*100)/100}
                </p>
                <p className="noprice">{Math.round(item.outcomePrices[1]*100)/100}
                </p>
            </p>

            <p className="mysharestext">My Shares
                <p className="yesprice"> {yesbalance}
                </p>
                 <p className="noprice"> {nobalance}
                </p>
            </p>

            <fieldset>
                <Form.Group as={Row} className="yesnospacing">
                <Col >
                    <Form.Check onClick={() => {Setradiostate(0)}}
                    type="radio"
                    label="Yes"
                    name="formHorizontalRadios"
                    id="formHorizontalRadios1"
                    required
                    />
                    <Form.Check onClick={() => {Setradiostate(1)}}
                    type="radio"
                    label="No"
                    name="formHorizontalRadios"
                    id="formHorizontalRadios2"
                    required
                    />
                </Col>
                </Form.Group>
            </fieldset>
            
        </div> 
        
        }
      
      </form>



      
    </div>

    


  
  )
}

export default MarketBox