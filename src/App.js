import logo from './logo.svg';
import './App.css';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';
import { purple } from '@material-ui/core/colors';
import Grid from '@material-ui/core/Grid';
import React, { useState, useEffect, useRef } from 'react';
import PancakeFactory from './abi/PancakeFactory.json';
import PancakeRouter from './abi/PancakeRouter.json';
import Web3 from 'web3';

function App() {

  const demicals = 1000000000000000000;
  let [myAccount,setMyAccount] = useState("CONNECT YOUR WALLET");
  const [accounts,setAccounts] = useState();
  const [myContract,setMyContract] = useState();
  const [myRouterContract,setMyRouterContract] = useState();
  const [myHongContract, setMyHongContract] = useState();
  const [myBUSDContract, setMyBUSDContract] = useState();
  const [myLPContract, setMyLPContract] = useState();
  const [currentNetworkID,setcurrentNetworkID] = useState();

  const refreshPage = ()=> {
    window.location.reload(false);
  }

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

      const data = require('./abi/Hong.json');

      setMyContract(await new window.web3.eth.Contract(PancakeFactory.abi, '0x83f9805d24d72377d628D2B8d04C2C524fC774C9'));
      setMyRouterContract(await new window.web3.eth.Contract(PancakeRouter.abi, '0xE0651d22dB6b1681B0B5DB1049B60123Efc2E348'));
      setMyHongContract(await new window.web3.eth.Contract(data, '0xd98996c1DB608Ff8C265428796b44Ae8e8642289'));
      setMyBUSDContract(await new window.web3.eth.Contract(data, '0xeD24FC36d5Ee211Ea25A80239Fb8C4Cfd80f12Ee'));
      setMyLPContract(await new window.web3.eth.Contract(data, '0xb043516b7bbd5d4eea5e5c29ab246c8fa8a5d2ea'));
    }
  }

  const addLiquidityFunction = async() => {
    if (myContract) {
      let args: Array<string | string[] | number> = [
        '0xd98996c1DB608Ff8C265428796b44Ae8e8642289',
        '0xeD24FC36d5Ee211Ea25A80239Fb8C4Cfd80f12Ee',
        window.web3.utils.toBN(100000000000000000).toString(),
        window.web3.utils.toBN(100000000000000000).toString(),
        window.web3.utils.toBN(0).toString(),
        window.web3.utils.toBN(0).toString(),
        myAccount,
        '1741306645'
      ]

      let approveArgs: Array<string | string[] | number> = [
        '0xE0651d22dB6b1681B0B5DB1049B60123Efc2E348',
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
        '0xd98996c1DB608Ff8C265428796b44Ae8e8642289',
        '0xeD24FC36d5Ee211Ea25A80239Fb8C4Cfd80f12Ee',
        window.web3.utils.toBN(100000000000000000).toString(),
        window.web3.utils.toBN(100000000000000000).toString(),
        window.web3.utils.toBN(0).toString(),
        myAccount,
        '1741306645'
      ]

      let approveArgs: Array<string | string[] | number> = [
        '0xE0651d22dB6b1681B0B5DB1049B60123Efc2E348',
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
        ["0xeD24FC36d5Ee211Ea25A80239Fb8C4Cfd80f12Ee", "0xd98996c1DB608Ff8C265428796b44Ae8e8642289"],
        myAccount,
        '1741306645'
      ]

      let approveArgs: Array<string | string[] | number> = [
        '0xE0651d22dB6b1681B0B5DB1049B60123Efc2E348',
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
        ["0xd98996c1DB608Ff8C265428796b44Ae8e8642289", "0xeD24FC36d5Ee211Ea25A80239Fb8C4Cfd80f12Ee"],
        myAccount,
        '1741306645'
      ]

      let approveArgs: Array<string | string[] | number> = [
        '0xE0651d22dB6b1681B0B5DB1049B60123Efc2E348',
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

  const ColorButton = withStyles((theme) => ({
    root: {
      color: theme.palette.getContrastText(purple[500]),
      backgroundColor: purple[500],
      '&:hover': {
        backgroundColor: purple[700],
      },
    },
  }))(Button);

  useEffect(() => {
    document.title = "UntitledSwap"
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          UntitledSwap
        </p>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Button variant="contained" color="primary" onClick={ethEnabled}>Connect Wallet</Button>
          </Grid>
          <Grid item xs={6}>
            <Button variant="contained" color="primary" onClick={addLiquidityFunction}>Add Liquidity</Button>
          </Grid>
          <Grid item xs={6}>
            <Button variant="contained" color="primary" onClick={swapBUSDToHONG}>From 0.1 BUSD to HONG </Button>
          </Grid>
          <Grid item xs={6}>
            <ColorButton variant="contained" color="secondary" onClick={removeLiquidityFunction}>Remove Liquidity</ColorButton>
          </Grid>
          <Grid item xs={6}>
            <ColorButton variant="contained" color="secondary" onClick={swapHONGToBUSD}>From 0.1 HONG to BUSD </ColorButton>
          </Grid>
        </Grid>
      </header>
    </div>
  );
}

export default App;
