import logo from './logo.svg';
import './App.css';
import React, { useState, useEffect } from 'react';
import PancakeFactory from './abi/PancakeFactory.json';
import PancakeRouter from './abi/PancakeRouter.json';
import Web3 from 'web3';
import { Button, ButtonGroup, Container, Row, Col, Card, ListGroup, ListGroupItem } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const MY_CONTRACT = process.env.REACT_APP_MY_CONTRACT
const MY_ROUTER_CONTRACT=process.env.REACT_APP_MY_ROUTER_CONTRACT
const MY_HONG_CONTRACT=process.env.REACT_APP_MY_HONG_CONTRACT
const MY_BUSD_CONTRACT=process.env.REACT_APP_MY_BUSD_CONTRACT
const MY_LP_CONTRACT=process.env.REACT_APP_MY_LP_CONTRACT
const MY_MASTERCHEF_CONTRACT=process.env.REACT_APP_MY_MASTERCEHF_CONTRACT

function App() {

  let [myAccount,setMyAccount] = useState("CONNECT YOUR WALLET");
  const [myContract,setMyContract] = useState();
  const [myRouterContract,setMyRouterContract] = useState();
  const [myHongContract, setMyHongContract] = useState();
  const [myBUSDContract, setMyBUSDContract] = useState();
  const [myLPContract, setMyLPContract] = useState();
  const [myMasterChefContract, setMyMasterChefContract] = useState();
  const [currentNetworkID,setcurrentNetworkID] = useState();
  const [amountOut,setAmountOut] = useState();
  const [amountIn,setAmountIn] = useState();

  const ethEnabled = async() => {
    if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider);
      await window.ethereum.enable();
      const web3js = await window.web3;
      const accounts = await web3js.eth.getAccounts(function (result) {
        console.log("account error:", result);
      });

      const networkID = await web3js.eth.net.getId();
      if (networkID) {
        setcurrentNetworkID(networkID)
      }

      setMyAccount(accounts[0])

      const dataHong = require('./abi/Hong.json');
      const dataLpToken = require('./abi/lpToken.json');
      const dataMasterChef = require('./abi/MasterChef.json');

      setMyContract(await new window.web3.eth.Contract(PancakeFactory.abi, MY_CONTRACT));
      setMyRouterContract(await new window.web3.eth.Contract(PancakeRouter.abi, MY_ROUTER_CONTRACT));
      setMyHongContract(await new window.web3.eth.Contract(dataHong, MY_HONG_CONTRACT));
      setMyBUSDContract(await new window.web3.eth.Contract(dataHong, MY_BUSD_CONTRACT));
      setMyLPContract(await new window.web3.eth.Contract(dataLpToken, MY_LP_CONTRACT));
      setMyMasterChefContract(await new window.web3.eth.Contract(dataMasterChef, MY_MASTERCHEF_CONTRACT));
    }
  }

  const refreshPrice = () => {

    if (myRouterContract) {
      let argsGetAmountsOut: Array<string | string[] | number> = [
        window.web3.utils.toBN(100000000000000000).toString(),
        [MY_HONG_CONTRACT, MY_BUSD_CONTRACT]
      ]

      let argsGetAmountsIn: Array<string | string[] | number> = [
        window.web3.utils.toBN(100000000000000000).toString(),
        [MY_BUSD_CONTRACT, MY_HONG_CONTRACT]
      ]

      myRouterContract.methods.getAmountsOut(...argsGetAmountsOut).call({from: myAccount}, function (result, error) {
        setAmountOut(error[1] / error[0]);
      });

      myRouterContract.methods.getAmountsOut(...argsGetAmountsIn).call({from: myAccount}, function (result, error) {
        setAmountIn(error[1] / error[0]);
      });
    }
  }

  const addLiquidityFunction = async() => {
    if (myContract) {
      let args: Array<string | string[] | number> = [
        MY_HONG_CONTRACT,
        MY_BUSD_CONTRACT,
        window.web3.utils.toBN(100000000000000000).toString(),
        window.web3.utils.toBN(100000000000000000).toString(),
        window.web3.utils.toBN(0).toString(),
        window.web3.utils.toBN(0).toString(),
        myAccount,
        '1741306645'
      ]

      let approveArgs: Array<string | string[] | number> = [
        MY_ROUTER_CONTRACT,
        window.web3.utils.toBN(1000000000000000000).toString()
      ]

      myHongContract.methods.approve(...approveArgs).send({from: myAccount}, function(result, error) {
        console.log("myHongContract approve");
        console.log(result);
        console.log(error);

        myBUSDContract.methods.approve(...approveArgs).send({from: myAccount}, function (result, error) {
          console.log("myBUSDContract approve");
          console.log(result);
          console.log(error);

          myRouterContract.methods.addLiquidity(...args).send({from: myAccount}, function(result, error) {
            console.log("myRouterContract addLiquidity");
            console.log(result);
            console.log(error);
          });
        });

      });
    }
    return false;
  }

  const removeLiquidityFunction = async() => {
    if (myContract) {
      let args: Array<string | string[] | number> = [
        MY_HONG_CONTRACT,
        MY_BUSD_CONTRACT,
        window.web3.utils.toBN(100000000000000000).toString(),
        window.web3.utils.toBN(100000000000000000).toString(),
        window.web3.utils.toBN(0).toString(),
        myAccount,
        '1741306645'
      ]

      let approveArgs: Array<string | string[] | number> = [
        MY_ROUTER_CONTRACT,
        window.web3.utils.toBN(1000000000000000000).toString()
      ]

      myLPContract.methods.approve(...approveArgs).send({from: myAccount}, function (result, error) {
        console.log("myLPContract approve");
        console.log(result);
        console.log(error);

        myRouterContract.methods.removeLiquidity(...args).send({from: myAccount}, function(result, error) {
          console.log("myRouterContract removeLiquidity");
          console.log(result);
          console.log(error);
        });
      });
    }
    return false;
  }

  const swapBUSDToHONG = async() => {
    if (myContract) {
      let args: Array<string | string[] | number> = [
        window.web3.utils.toBN(100000000000000000).toString(),
        window.web3.utils.toBN(0).toString(),
        [MY_BUSD_CONTRACT, MY_HONG_CONTRACT],
        myAccount,
        '1741306645'
      ]

      let approveArgs: Array<string | string[] | number> = [
        MY_ROUTER_CONTRACT,
        window.web3.utils.toBN(1000000000000000000).toString()
      ]

      myBUSDContract.methods.approve(...approveArgs).send({from: myAccount}, function (result, error) {
        console.log("myBUSDContract approve");
        console.log(result);
        console.log(error);

        myRouterContract.methods.swapExactTokensForTokens(...args).send({from: myAccount}, function (result, error) {
          console.log("myRouterContract swapExactTokensForTokens");
          console.log(result);
          console.log(error);
        });
      });
    }
  }

  const swapHONGToBUSD = () => {
    if (myContract) {
      let args: Array<string | string[] | number> = [
        window.web3.utils.toBN(100000000000000000).toString(),
        window.web3.utils.toBN(0).toString(),
        [MY_HONG_CONTRACT, MY_BUSD_CONTRACT],
        myAccount,
        '1741306645'
      ]

      let approveArgs: Array<string | string[] | number> = [
        MY_ROUTER_CONTRACT,
        window.web3.utils.toBN(1000000000000000000).toString()
      ]

      myHongContract.methods.approve(...approveArgs).send({from: myAccount}, function (result, error) {
        console.log("myHongContract approve");
        console.log(result);
        console.log(error);

        myRouterContract.methods.swapExactTokensForTokens(...args).send({from: myAccount}, function(result, error) {
          console.log("myRouterContract swapExactTokensForTokens");
          console.log(result);
          console.log(error);
        });
      });
    }
    return false;
  }

  const stake = () => {
    if (myMasterChefContract) {
      let args: Array<string | string[] | number> = [
        window.web3.utils.toBN(1).toString(),
        window.web3.utils.toBN(100000000000000000).toString()
      ]

      let approveArgs: Array<string | string[] | number> = [
        MY_MASTERCHEF_CONTRACT,
        window.web3.utils.toBN(1000000000000000000).toString()
      ]

      myLPContract.methods.approve(...approveArgs).send({from: myAccount}, function (result, error) {
        console.log("myLPContract approve");
        console.log(result);
        console.log(error);

        myMasterChefContract.methods.deposit(...args).send({from: myAccount}, function(result, error) {
          console.log("myMasterChefContract deposit");
          console.log(result);
          console.log(error);
        });
      });
    }
    return false;
  }

  const unstake = () => {
    if (myMasterChefContract) {
      let args: Array<string | string[] | number> = [
        window.web3.utils.toBN(1).toString(),
        window.web3.utils.toBN(100000000000000000).toString()
      ]

      myMasterChefContract.methods.withdraw(...args).send({from: myAccount}, function(result, error) {
        console.log("myMasterChefContract withdraw");
        console.log(result);
        console.log(error);
      });
    }
    return false;
  }

  const pendingReward = () => {
    if (myMasterChefContract) {
      let args: Array<string | string[] | number> = [
        window.web3.utils.toBN(1).toString(),
        myAccount
      ]

      myMasterChefContract.methods.pendingCake(...args).call({from: myAccount}, function(result, error) {
        console.log("myMasterChefContract pendingCake");
        console.log(result);
        console.log(error);
      });
    }
    return false;
  }

  const poolInfo = () => {
    if (myMasterChefContract) {
      let args: Array<string | string[] | number> = [
        window.web3.utils.toBN(1).toString()
      ]

      myMasterChefContract.methods.poolInfo(...args).call({}, function(result, error) {
        console.log("myMasterChefContract poolInfo");
        console.log(result);
        console.log(error);
      });
    }
    return false;
  }

  const userInfo = () => {
    if (myMasterChefContract) {
      let args: Array<string | string[] | number> = [
        window.web3.utils.toBN(1).toString(),
        myAccount
      ]

      myMasterChefContract.methods.userInfo(...args).call({}, function(result, error) {
        console.log("myMasterChefContract userInfo");
        console.log(result);
        console.log(error);
      });
    }
    return false;
  }

  useEffect(() => {
    document.title = "Capital"
  }, []);

  return (
        <div className="App">
        <header className="App-header">
          <Container>
            <Row>
              <Col>
                <Card>
                  <Card.Body>
                    <Card.Title>HONG/BUSD Swap</Card.Title>
                    <Card.Subtitle>1 BUSD to {amountIn} HONG</Card.Subtitle>
                    <Card.Subtitle>&nbsp;</Card.Subtitle>
                    <Card.Subtitle>1 HONG to {amountOut} BUSD</Card.Subtitle>
                    <ListGroup className="list-group-flush">
                      <ListGroupItem><Button variant="light" onClick={ethEnabled}>Connect Wallet</Button></ListGroupItem>
                      <ListGroupItem><Button variant="light" onClick={refreshPrice}>Refresh Price</Button></ListGroupItem>
                      <ListGroupItem><Button variant="light" onClick={swapBUSDToHONG}>From 0.1 BUSD to HONG </Button></ListGroupItem>
                      <ListGroupItem><Button variant="light" onClick={swapHONGToBUSD}>From 0.1 HONG to BUSD </Button></ListGroupItem>
                      <ListGroupItem><Button variant="light" onClick={addLiquidityFunction}>Add 1:1 Liquidity</Button></ListGroupItem>
                      <ListGroupItem><Button variant="light" onClick={removeLiquidityFunction}>Remove 1:1 Liquidity</Button></ListGroupItem>
                    </ListGroup>
                  </Card.Body>
                </Card>
              </Col>
              <Col>
                <Card>
                  <Card.Body>
                    <Card.Title>HONG/BUSD Liquidity Farm </Card.Title>
                    <Card.Subtitle>Rewards: HONG</Card.Subtitle>
                    <ListGroup className="list-group-flush">
                      <ListGroupItem><Button variant="light" onClick={poolInfo}>Farm Info </Button></ListGroupItem>
                      <ListGroupItem><Button variant="light" onClick={userInfo}>My Staking Info</Button></ListGroupItem>
                      <ListGroupItem><Button variant="light" onClick={stake}>Stake 1 LP to Farm </Button></ListGroupItem>
                      <ListGroupItem><Button variant="light" onClick={unstake}>Unstake 1 LP to Farm </Button></ListGroupItem>
                      <ListGroupItem><Button variant="light" onClick={pendingReward}>Show pending rewards </Button></ListGroupItem>
                    </ListGroup>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Container>
        </header>
        </div>
  );
}

export default App;
