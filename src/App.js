import logo from './logo.svg';
import './App.css';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import { withStyles } from '@material-ui/core/styles';
import { purple } from '@material-ui/core/colors';
import Grid from '@material-ui/core/Grid';
import React, { useState, useEffect } from 'react';
import PancakeFactory from './abi/PancakeFactory.json';
import PancakeRouter from './abi/PancakeRouter.json';
import Web3 from 'web3';

const MY_CONTRACT = process.env.REACT_APP_MY_CONTRACT
const MY_ROUTER_CONTRACT=process.env.REACT_APP_MY_ROUTER_CONTRACT
const MY_HONG_CONTRACT=process.env.REACT_APP_MY_HONG_CONTRACT
const MY_BUSD_CONTRACT=process.env.REACT_APP_MY_BUSD_CONTRACT
const MY_LP_CONTRACT=process.env.REACT_APP_MY_LP_CONTRACT

function App() {

  let [myAccount,setMyAccount] = useState("CONNECT YOUR WALLET");
  const [myContract,setMyContract] = useState();
  const [myRouterContract,setMyRouterContract] = useState();
  const [myHongContract, setMyHongContract] = useState();
  const [myBUSDContract, setMyBUSDContract] = useState();
  const [myLPContract, setMyLPContract] = useState();
  const [currentNetworkID,setcurrentNetworkID] = useState();

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

      console.log(accounts);
      setMyAccount(accounts[0])
      console.log("Account connected?");
      console.log(myAccount);
      console.log(currentNetworkID);

      const data = require('./abi/Hong.json');

      setMyContract(await new window.web3.eth.Contract(PancakeFactory.abi, MY_CONTRACT));
      setMyRouterContract(await new window.web3.eth.Contract(PancakeRouter.abi, MY_ROUTER_CONTRACT));
      setMyHongContract(await new window.web3.eth.Contract(data, MY_HONG_CONTRACT));
      setMyBUSDContract(await new window.web3.eth.Contract(data, MY_BUSD_CONTRACT));
      setMyLPContract(await new window.web3.eth.Contract(data, MY_LP_CONTRACT));
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

  useEffect(() => {
    document.title = "Capital"
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Capital
        </p>
        <Grid container>
          <Grid item xs={12}>
            <ButtonGroup color="primary" aria-label="outlined primary button group">
              <Button onClick={ethEnabled}>Connect Wallet</Button>
            </ButtonGroup>
          </Grid>
          <Grid item xs={12}>
            <ButtonGroup orientation="vertical" variant="text" color="primary" aria-label="outlined primary button group">
              <Button color="primary" onClick={addLiquidityFunction}>Add Liquidity</Button>
              <Button color="secondary" onClick={removeLiquidityFunction}>Remove Liquidity</Button>
            </ButtonGroup>
          </Grid>
          <Grid item xs={12}>
            <ButtonGroup orientation="vertical" variant="text" color="primary" aria-label="outlined primary button group">
              <Button color="primary" onClick={swapBUSDToHONG}>From 0.1 BUSD to HONG </Button>
              <Button color="secondary" onClick={swapHONGToBUSD}>From 0.1 HONG to BUSD </Button>
            </ButtonGroup>
          </Grid>
        </Grid>
      </header>
    </div>
  );
}

export default App;
