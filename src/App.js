import './App.css';
import React, { useState, useEffect } from 'react';

import Controller from './abi/fujidao/Controller.json';
import FujiVaultAVAX from './abi/fujidao/FujiVaultAVAX.json';
import FliquidatorAVAX from './abi/fujidao/FliquidatorAVAX.json';
import FujiOracle from './abi/fujidao/FujiOracle.json';

import Web3 from 'web3';
import {Button, Container, Row, Col, Card, ListGroup, ListGroupItem } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const BSCSCAN_TESTNET=process.env.REACT_APP_BSCSCAN_TESTNET
const GITHUB=process.env.REACT_APP_GITHUB
const MY_FujiVaultETHBTC=process.env.REACT_APP_MY_FujiVaultETHBTC;
const MY_FliquidatorAVAX=process.env.REACT_APP_MY_FliquidatorAVAX;
const MY_FujiController=process.env.REACT_APP_MY_FujiController;
const MY_FujiOracle=process.env.REACT_APP_MY_FujiOracle;
const WBTC=process.env.REACT_APP_WBTC;
const WETH=process.env.REACT_APP_WETH;

function App() {

  let [myAccount,setMyAccount] = useState("CONNECT YOUR WALLET");

  const [ethNeededCollateral, setEthNeededCollateral] = useState();
  const [userDepositBalance, setUserDepositBalance] = useState();
  const [userDebtBalance, setUserDebtBalance] = useState();

  const [myFujiVaultETHBTC, setMyFujiVaultETHBTC] = useState();
  const [myFliquidatorAVAX, setMyFliquidatorAVAX] = useState();
  const [myFujiController, setMyFujiController] = useState();
  const [myFujiOracle, setMyFujiOracle] = useState();

  const [myETHContract, setMyETHContract] = useState();
  const [myBTCContract, setMyBTCContract] = useState();

  const ethEnabled = async() => {
    if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider);
      await window.ethereum.enable();
      const web3js = await window.web3;
      const accounts = await web3js.eth.getAccounts(function (result) {
        console.log("account error:", result);
      });

      setMyAccount(accounts[0])

      const dataHong = require('./abi/Hong.json');
      setMyFujiVaultETHBTC(await new  window.web3.eth.Contract(FujiVaultAVAX.abi, MY_FujiVaultETHBTC));
      setMyFliquidatorAVAX(await new  window.web3.eth.Contract(FliquidatorAVAX.abi, MY_FliquidatorAVAX));
      setMyFujiController(await new  window.web3.eth.Contract(Controller.abi, MY_FujiController));
      setMyFujiOracle(await new  window.web3.eth.Contract(FujiOracle.abi, MY_FujiOracle));

      setMyETHContract(await new  window.web3.eth.Contract(dataHong, WETH));
      setMyBTCContract(await new  window.web3.eth.Contract(dataHong, WBTC));
    }
  }

  const getNeededCollateralFor = () => {
    if (myFujiVaultETHBTC) {
      let args: Array<string | string[] | number> = [
        1,
        true
      ]
      myFujiVaultETHBTC.methods.getNeededCollateralFor(...args).call({}, function(error, result) {
        console.log(result);
        setEthNeededCollateral((result / 10000000000));
      });

      myFujiVaultETHBTC.methods.userDepositBalance(myAccount).call({}, function(error, result) {
        console.log(result);
        setUserDepositBalance((result / 1000000000000000000));
      });

      myFujiVaultETHBTC.methods.userDebtBalance(myAccount).call({}, function(error, result) {
        console.log(result);
        setUserDebtBalance((result / 10000000000));
      });
    }
  }

  const deposit = () => {
    if (myFujiVaultETHBTC) {
      let approveArgs: Array<string | string[] | number> = [
        MY_FujiVaultETHBTC,
        window.web3.utils.toBN(10000000000000).toString()
      ]

      let args: Array<string | string[] | number> = [
        window.web3.utils.toBN(10000000000000).toString()
      ]

      myETHContract.methods.approve(...approveArgs).send({from: myAccount}, function (result, error) {
        console.log("myFujiVaultETHBTC approve");
        console.log(result);
        console.log(error);
        myFujiVaultETHBTC.methods.deposit(...args).send({from: myAccount}, function(error, result) {
          console.log(result);
        });
      });
    }
  }

  const withdraw = () => {
    if (myFujiVaultETHBTC) {

      let args: Array<string | string[] | number> = [
        window.web3.utils.toBN(10000000000000).toString()
      ]

      myFujiVaultETHBTC.methods.withdraw(...args).send({from: myAccount}, function(error, result) {
        console.log(result);
      });
    }
  }

  const borrow = () => {
    if (myFujiVaultETHBTC) {
      let args: Array<string | string[] | number> = [
        window.web3.utils.toBN(10).toString()
      ]

      myFujiVaultETHBTC.methods.borrow(...args).send({from: myAccount}, function(error, result) {
        console.log(result);
      });
    }
  }

  const payback = () => {
    if (myFujiVaultETHBTC) {
      let approveArgs: Array<string | string[] | number> = [
        MY_FujiVaultETHBTC,
        window.web3.utils.toBN(10000000000000).toString()
      ]

      let args: Array<string | string[] | number> = [
        window.web3.utils.toBN(10).toString()
      ]

      myBTCContract.methods.approve(...approveArgs).send({from: myAccount}, function (result, error) {
        console.log("myBTCContract approve");
        console.log(result);
        console.log(error);
        myFujiVaultETHBTC.methods.payback(...args).send({from: myAccount}, function(error, result) {
          console.log(result);
        });
      });
    }
  }

  const batchLiqudate = () => {
    if (myFliquidatorAVAX) {
      let approveArgs: Array<string | string[] | number> = [
        MY_FliquidatorAVAX,
        window.web3.utils.toBN(10000000000000000000).toString()
      ]

      let liqudatable : string[] = [];
      liqudatable.push(myAccount);

      let args: Array<string | string[] | number> = [
        liqudatable,
        MY_FujiVaultETHBTC
      ]

      myBTCContract.methods.approve(...approveArgs).send({from: myAccount}, function (result, error) {
        console.log("myBTCContract approve");
        myFliquidatorAVAX.methods.batchLiquidate(...args).send({from: myAccount}, function(error, result) {
          console.log(result);
        });
      });
    }
  }


  const flashBatchLiquidate = () => {
    if (myFliquidatorAVAX) {
      let approveArgs: Array<string | string[] | number> = [
        MY_FliquidatorAVAX,
        window.web3.utils.toBN(10000000000000000000).toString()
      ]

      let liqudatable : string[] = [myAccount];

      let args: Array<string | string[] | number> = [
        liqudatable,
        MY_FujiVaultETHBTC,
          0
      ]

      myBTCContract.methods.approve(...approveArgs).send({from: myAccount}, function (result, error) {
        console.log("myBTCContract approve");
        myFliquidatorAVAX.methods.flashBatchLiquidate(...args).send({from: myAccount}, function(error, result) {
          console.log(result);
        });
      });
    }
  }

  const flashClose = () => {
    if (myFliquidatorAVAX) {
      let args: Array<string | string[] | number> = [
        -1,
        MY_FujiVaultETHBTC,
        0
      ]

        myFliquidatorAVAX.methods.flashClose(...args).send({from: myAccount}, function(error, result) {
          console.log(result);
        });
    }
  }

  const refinanceFromAToB = () => {
    if (myFujiController) {
      let args: Array<string | string[] | number> = [
        MY_FujiVaultETHBTC,
        "0xe7A190921bB7ff61F518077E16955a2D2cBb833E",
        0
      ]

      myFujiController.methods.doRefinancing(...args).send({from: myAccount}, function(error, result) {
        console.log(result);
      });
    }
  }

  const refinanceFromBToA = () => {
    if (myFujiController) {
      let args: Array<string | string[] | number> = [
        MY_FujiVaultETHBTC,
        "0x2e9da9Fea32c4e60Ddf1a8f47D7F2252a8F26CD0",
        0
      ]

      myFujiController.methods.doRefinancing(...args).send({from: myAccount}, function(error, result) {
        console.log(result);
      });
    }
  }

  useEffect(() => {
    document.title = "Senior Deli Defi"

    ethEnabled()
  }, []);

  let testnet_MY_CONTRACT = BSCSCAN_TESTNET + MY_FujiVaultETHBTC;

  return (
        <div className="App">
        <header className="App-header">
          <Container>
            <Row>
              <Col>
                <h3>Senior Deli Defi</h3>
                <h4>Needs {ethNeededCollateral} ETH as collateral to borrow 1 BTC, including safety factors</h4>
                <h4>You deposited {userDepositBalance} ETH as collateral</h4>
                <h4>You borrowed {userDebtBalance} BTC</h4>
                <Button variant="danger" onClick={ethEnabled}>Connect Wallet</Button>
                <Button variant="dark" onClick={getNeededCollateralFor}>Refresh</Button>
              </Col>
            </Row>
            <Row>
              <Col>
                <Card>
                  <Card.Body>
                    <Card.Title>FujiDAO</Card.Title>
                    <ListGroup className="list-group-flush">
                      <ListGroupItem><Button variant="light" onClick={deposit}>Deposit 0.00001 ETH to vault</Button></ListGroupItem>
                      <ListGroupItem><Button variant="light" onClick={withdraw}>Withdraw 0.00001 ETH from vault</Button></ListGroupItem>
                      <ListGroupItem><Button variant="light" onClick={borrow}>Borrow 0.00000001 BTC from vault</Button></ListGroupItem>
                      <ListGroupItem><Button variant="light" onClick={payback}>Payback 0.00000001 BTC to vault</Button></ListGroupItem>
                      <ListGroupItem><Button variant="light" onClick={flashClose}>Flash close myself</Button></ListGroupItem>
                    </ListGroup>
                    <ListGroup className="list-group-flush">
                      <ListGroupItem><Button variant="dark" onClick={batchLiqudate}>Liqudate myself</Button></ListGroupItem>
                      <ListGroupItem><Button variant="dark" onClick={flashBatchLiquidate}>Flash Liqudate myself</Button></ListGroupItem>
                      <ListGroupItem><Button variant="dark" onClick={refinanceFromAToB}>Refinance from A to B</Button></ListGroupItem>
                      <ListGroupItem><Button variant="dark" onClick={refinanceFromBToA}>Refinance from B to A</Button></ListGroupItem>
                    </ListGroup>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
            <Row>
              <Col>
                <h5><a target="_blank" rel="noreferrer" href={testnet_MY_CONTRACT}>View Contract in Avalanche Explorer</a></h5>
                <h5><a target="_blank" rel="noreferrer" href={GITHUB}>GitHub</a></h5>
              </Col>
            </Row>
          </Container>
        </header>
        </div>
  );
}

export default App;
