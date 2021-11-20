import './App.css';
import React, { useState, useEffect } from 'react';
import PancakeFactory from './abi/PancakeFactory.json';
import PancakeRouter from './abi/PancakeRouter.json';
import Web3 from 'web3';
import {Button, Container, Row, Col, Card, ListGroup, ListGroupItem } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const MY_CONTRACT = process.env.REACT_APP_MY_CONTRACT
const MY_ROUTER_CONTRACT=process.env.REACT_APP_MY_ROUTER_CONTRACT
const MY_HONG_CONTRACT=process.env.REACT_APP_MY_HONG_CONTRACT
const MY_BUSD_CONTRACT=process.env.REACT_APP_MY_BUSD_CONTRACT
const MY_LP_CONTRACT=process.env.REACT_APP_MY_LP_CONTRACT
const MY_MASTERCHEF_CONTRACT=process.env.REACT_APP_MY_MASTERCEHF_CONTRACT
const MY_SYRUP_CONTRACT=process.env.REACT_APP_MY_SYRUP_CONTRACT
const MY_CAKE_CONTRACT=process.env.REACT_APP_MY_CAKE_CONTRACT
const BSCSCAN_TESTNET=process.env.REACT_APP_BSCSCAN_TESTNET
const GITHUB=process.env.REACT_APP_GITHUB

const MY_LENDING_POOL_CONFIGURATOR=process.env.REACT_APP_MY_LENDING_POOL_CONFIGURATOR_CONTRACT;
const MY_LENDING_POOL_ADDRESS_PROVIDER=process.env.REACT_APP_MY_LENDING_POOL_ADDRESS_PROVIDER_CONTRACT;
const MY_LENDING_POOL_COLLATERAL_MANAGER_CONTRACT=process.env.REACT_APP_MY_LENDING_POOL_COLLATERAL_MANAGER_CONTRACT;

const MY_CERC20IMMUTABLE=process.env.REACT_APP_MY_CERC20IMMUTABLE;
const MY_COMPTROLLER=process.env.REACT_APP_MY_COMPTROLLER;
const MY_ASSET=process.env.REACT_APP_MY_ASSET;

function App() {

  let [myAccount,setMyAccount] = useState("CONNECT YOUR WALLET");
  const [myContract,setMyContract] = useState();
  const [myRouterContract,setMyRouterContract] = useState();
  const [myHongContract, setMyHongContract] = useState();
  const [myBUSDContract, setMyBUSDContract] = useState();
  const [myLPContract, setMyLPContract] = useState();
  const [myMasterChefContract, setMyMasterChefContract] = useState();
  const [myLendingPoolConfigurationContract, setMyLendingPoolConfigurationContract] = useState();
  const [myLendingPoolAddressProviderContract, setMyLendingPoolAddressProviderContract] = useState();
  const [mycERC20Immutable, setMycERC20Immutable] = useState();
  const [myCompTroller, setMyCompTroller] = useState();
  const [myAsset, setMyAsset] = useState();

  const [amountOut,setAmountOut] = useState();
  const [amountIn,setAmountIn] = useState();
  const [hongReserve,setHongReserve] = useState();
  const [busdReserve,setBusdReservce] = useState();
  const [quotedLPRatio,setQuotedLPRatio] = useState();
  const [farmInfo, setFarmInfo] = useState();
  const [myFarmInfo, setMyFarmInfo] = useState();
  const [pendingRewardInfo, setPendingRewardInfo] = useState();
  const [lendingInfo, setLendingInfo] = useState();
  const [totalSupplyHong, setTotalSupplyHong] = useState();
  const [totalSupplyBUSD, setTotalSupplyBUSD] = useState();
  const [totalSupplyLending, setTotalSupplyLending] = useState();
  const [cash, setCash] = useState();

  const [totalSupplyLP, setTotalSupplyLP] = useState();

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
      const dataLpToken = require('./abi/lpToken.json');
      const dataMasterChef = require('./abi/MasterChef.json');
      const dataLendingPoolConfigurator = require('./abi/lending/LendingPoolConfigurator.json');
      const dataLendingPoolAddressProvider = require('./abi/lending/LendingPoolAddressProvider.json');
      const dataCERC20Immutable = require('./abi/lending/CERC20Immutable.json');
      const dataCompTroller = require('./abi/lending/CompTroller.json');
      const dataMyAsset = require('./abi/lending/MyAsset.json');

      setMyContract(await new window.web3.eth.Contract(PancakeFactory.abi, MY_CONTRACT));
      setMyRouterContract(await new window.web3.eth.Contract(PancakeRouter.abi, MY_ROUTER_CONTRACT));
      setMyHongContract(await new window.web3.eth.Contract(dataHong, MY_HONG_CONTRACT));
      setMyBUSDContract(await new window.web3.eth.Contract(dataHong, MY_BUSD_CONTRACT));
      setMyLPContract(await new window.web3.eth.Contract(dataLpToken, MY_LP_CONTRACT));
      setMyMasterChefContract(await new window.web3.eth.Contract(dataMasterChef, MY_MASTERCHEF_CONTRACT));
      setMyLendingPoolConfigurationContract(await new window.web3.eth.Contract(dataLendingPoolConfigurator, MY_LENDING_POOL_CONFIGURATOR));
      setMyLendingPoolAddressProviderContract(await new window.web3.eth.Contract(dataLendingPoolAddressProvider, MY_LENDING_POOL_ADDRESS_PROVIDER));
      setMycERC20Immutable(await new window.web3.eth.Contract(dataCERC20Immutable, MY_CERC20IMMUTABLE));
      setMyCompTroller(await new window.web3.eth.Contract(dataCompTroller, MY_COMPTROLLER));
      setMyAsset(await new window.web3.eth.Contract(dataMyAsset, MY_ASSET));
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
        if (result != null) {
          setAmountOut(result[1] / result[0]);
        } else {
          setAmountOut(error[1] / error[0]);
        }
      });

      myRouterContract.methods.getAmountsOut(...argsGetAmountsIn).call({from: myAccount}, function (result, error) {
        if (result != null) {
          setAmountIn(result[1] / result[0]);
        } else {
          setAmountIn(error[1] / error[0]);
        }
      });

      myHongContract.methods.totalSupply().call({}, function (error, result) {
       setTotalSupplyHong(result / 1000000000000000000);
      });

      myBUSDContract.methods.totalSupply().call({}, function (error, result) {
        setTotalSupplyBUSD(result / 1000000000000000000);
      });

      myLPContract.methods.totalSupply().call({}, function (error, result) {
        setTotalSupplyLP(result / 1000000000000000000);
      });

      myLPContract.methods.getReserves().call({from: myAccount}, function (result, error) {
        setHongReserve(error[0] / 1000000000000000000);
        setBusdReservce(error[1] / 1000000000000000000);
        let ratio1 = ("1 TCRO and " + error[0]/error[1] + " DELI to 1 LP");
        let ratio2 = ("1 DELI and " + error[1]/error[0] + " DELI(gov) to 1 LP");
        setQuotedLPRatio(error[1] > error[0] ? ratio1 : ratio2 );
      });

      userInfo()
      poolInfo()
      pendingReward()
    }
  }

  const refreshLending = () => {
    if (mycERC20Immutable) {
      mycERC20Immutable.methods.getCash().call({}, function (result, error) {
        console.log(result);
        console.log(error);
        setCash(error / 1000000000000000000);
      });

      mycERC20Immutable.methods.totalSupply().call({}, function (result, error) {
        console.log(result);
        console.log(error);
        setTotalSupplyLending(error / 1000000000000000000);
      });
    }
  }

  const supplyAssets = () => {
    if (mycERC20Immutable) {
      let approveArgs: Array<string | string[] | number> = [
        MY_CERC20IMMUTABLE,
        window.web3.utils.toBN(1000000000000000000).toString()
      ]
      let arg: Array<string | string[] | number> = [
        window.web3.utils.toBN(100000000000000000).toString()
      ]

      myAsset.methods.approve(...approveArgs).send({from: myAccount}, function (result, error) {
        console.log("myAsset approve");
        console.log(result);
        console.log(error);

        mycERC20Immutable.methods.mint(...arg).send({from: myAccount}, function(result, error) {
          console.log("mycERC20Immutable mint");
          console.log(result);
          console.log(error);
        });
      });
    }
  }

  const redeemAssets = () => {
    if (mycERC20Immutable) {
      let mintArg: Array<string | string[] | number> = [
        window.web3.utils.toBN(100000000000000000).toString()
      ]

      mycERC20Immutable.methods.redeem(...mintArg).send({from: myAccount}, function(result, error) {
        console.log("mycERC20Immutable redeem");
        console.log(result);
        console.log(error);
      });

    }
  }

  const borrowAssets = () => {

  }

  const repayBorrowAssets = () => {

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
        window.web3.utils.toBN(10000000000000000).toString(),
        window.web3.utils.toBN(10000000000000000).toString(),
        window.web3.utils.toBN(0).toString(),
        myAccount,
        '1741306645'
      ]

      let approveArgs: Array<string | string[] | number> = [
        MY_ROUTER_CONTRACT,
        window.web3.utils.toBN(100000000000000000).toString()
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
        window.web3.utils.toBN(2).toString(),
        window.web3.utils.toBN(10000000000000000).toString()
      ]

      let approveArgs: Array<string | string[] | number> = [
        MY_MASTERCHEF_CONTRACT,
        window.web3.utils.toBN(100000000000000000).toString()
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
        window.web3.utils.toBN(2).toString(),
        window.web3.utils.toBN(10000000000000000).toString()
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
        window.web3.utils.toBN(2).toString(),
        myAccount
      ]

      myMasterChefContract.methods.pendingCake(...args).call({from: myAccount}, function(error, result) {
        console.log(result);
        setPendingRewardInfo('Pending Reward: ' + (result  / 1000000000000000000));
      });
    }
    return false;
  }

  const poolInfo = () => {
    if (myMasterChefContract) {
      let args: Array<string | string[] | number> = [
        window.web3.utils.toBN(2).toString()
      ]
      let argsBalanceOf: Array<string | string[] | number> = [
        MY_MASTERCHEF_CONTRACT
      ]
      myMasterChefContract.methods.poolInfo(...args).call({}, function(error, result) {
        myLPContract.methods.balanceOf(...argsBalanceOf).call({}, function(error, result2) {
          myMasterChefContract.methods.cakePerBlock().call({}, function(error, result3) {
              setFarmInfo(
                  'Total staked LP token: ' + (result2 / 1000000000000000000)+ ", " +
                  'Deli Per Block: ' + result3 + ", " +
                  'Accumulative Reward Per Share: ' + result['accCakePerShare'] + ", " +
                  'Allocated Point: ' + result['allocPoint'] + ", " +
                  'Last Reward Block: ' + result['lastRewardBlock']);
            });
          });
      });
    }
    return false;
  }

  const userInfo = () => {
    if (myMasterChefContract) {
      let args: Array<string | string[] | number> = [
        window.web3.utils.toBN(2).toString(),
        myAccount
      ]
      myMasterChefContract.methods.userInfo(...args).call({}, function(error, result) {
        setMyFarmInfo(
            'My staked LP token: ' + (result['amount'] / 1000000000000000000))
      });
    }
    return false;
  }

  const getLendingPoolConfigurator = () => {
    if (myLendingPoolAddressProviderContract) {
      let args: Array<string | string[] | number> = [
      ]
      myLendingPoolAddressProviderContract.methods.getLendingPoolConfigurator(...args).call({}, function(error, result) {
        console.log(error)
        console.log(result)
      });
    }
  }

  const setLendingPoolConfigurator = () => {
    if (myLendingPoolAddressProviderContract) {
      let args: Array<string | string[] | number> = [
        MY_LENDING_POOL_CONFIGURATOR
      ]
      myLendingPoolAddressProviderContract.methods.setLendingPoolConfiguratorImpl(...args).send({from: myAccount}, function(error, result) {
        console.log(error)
        console.log(result)
      });
    }
  }

  const getLendingPoolCollateralManager = () => {
    if (myLendingPoolAddressProviderContract) {
      let args: Array<string | string[] | number> = [
      ]
      myLendingPoolAddressProviderContract.methods.getLendingPoolCollateralManager(...args).call({}, function(error, result) {
        console.log(error)
        console.log(result)
      });
    }
  }

  const setLendingPoolCollateralManager = () => {
    if (myLendingPoolAddressProviderContract) {
      let args: Array<string | string[] | number> = [
        MY_LENDING_POOL_COLLATERAL_MANAGER_CONTRACT
      ]
      myLendingPoolAddressProviderContract.methods.setLendingPoolCollateralManager(...args).send({from: myAccount}, function(error, result) {
        console.log(error)
        console.log(result)
      });
    }
  }

  const initReserve = () => {
    if (myLendingPoolConfigurationContract) {
      let initInputParams: {
        aTokenImpl: string;
        stableDebtTokenImpl: string;
        variableDebtTokenImpl: string;
        underlyingAssetDecimals: number;
        interestRateStrategyAddress: string;
        underlyingAsset: string;
        treasury: string;
        incentivesController: string;
        underlyingAssetName: string;
        aTokenName: string;
        aTokenSymbol: string;
        variableDebtTokenName: string;
        variableDebtTokenSymbol: string;
        stableDebtTokenName: string;
        stableDebtTokenSymbol: string;
        params: string;
      }[] = [];
      /**
       * @dev Initializes the aToken
       * @param pool The address of the lending pool where this aToken will be used
       * @param treasury The address of the Aave treasury, receiving the fees on this aToken
       * @param underlyingAsset The address of the underlying asset of this aToken (E.g. WETH for aWETH)
       * @param incentivesController The smart contract managing potential incentives distribution
       * @param aTokenDecimals The decimals of the aToken, same as the underlying asset's
       * @param aTokenName The name of the aToken
       * @param aTokenSymbol The symbol of the aToken
       */
      initInputParams.push({
        aTokenImpl: '0x8cA93B3d4e35B2886597bC9E06c3900029E26925',
        stableDebtTokenImpl: '0xa36FA1d06d0c6f79242879Dc34Bf47Bd4B6282Ed',
        variableDebtTokenImpl: '0xfDaA4aA2D457357Ec0Be63eF54c7efF0601aba68',
        underlyingAssetDecimals: 0,
        interestRateStrategyAddress: '0x190701d7B10Fe1c46075544c9EC7E2230e16056A',
        underlyingAsset: '0xeA61f8F65095aceAa9344a1ddA0849F16Cf6cdAb',
        treasury: '0xe71fa402007FAD17dA769D1bBEfA6d0790fCe2c7',
        incentivesController: '0x0000000000000000000000000000000000000000',
        underlyingAssetName: 'DELI',
        aTokenName: 'aDELI',
        aTokenSymbol: 'aDELI',
        variableDebtTokenName: 'vDELI',
        variableDebtTokenSymbol: 'vDELI',
        stableDebtTokenName: 'sDELI',
        stableDebtTokenSymbol: 'sDELI',
        params: '0x10'
      });

      myLendingPoolConfigurationContract.methods.batchInitReserve(initInputParams).send({from: myAccount}, function(result, error) {
        console.log("myLendingPoolConfigurationContract batchInitReserve");
        console.log(result);
        console.log(error);
      });
    }
  }

  useEffect(() => {
    document.title = "Senior Deli Defi"

    setAmountIn("?")
    setAmountOut("?")
    setQuotedLPRatio("? DELI and ? DELI(gov) to 1 LP")
    setQuotedLPRatio("? DELI and ? DELI(gov) to 1 LP")

    ethEnabled()
  }, []);

  let testnet_MY_CONTRACT = BSCSCAN_TESTNET + MY_CONTRACT;
  let testnet_MY_ROUTER_CONTRACT = BSCSCAN_TESTNET + MY_ROUTER_CONTRACT;
  let testnet_MY_HONG_CONTRACT = BSCSCAN_TESTNET + MY_HONG_CONTRACT;
  let testnet_MY_BUSD_CONTRACT = BSCSCAN_TESTNET + MY_BUSD_CONTRACT;
  let testnet_MY_LP_CONTRACT = BSCSCAN_TESTNET + MY_LP_CONTRACT;
  let testnet_MY_MASTERCHEF_CONTRACT = BSCSCAN_TESTNET + MY_MASTERCHEF_CONTRACT;
  let testnet_MY_SYRUP_CONTRACT = BSCSCAN_TESTNET + MY_SYRUP_CONTRACT;
  let testnet_MY_CAKE_CONTRACT = BSCSCAN_TESTNET + MY_CAKE_CONTRACT;

  return (
        <div className="App">
        <header className="App-header">
          <Container>
            <Row>
              <Col>
                <h3>Senior Deli Defi</h3>
                <Button variant="danger" onClick={ethEnabled}>Connect Wallet with Cronos Testnet</Button>
                <Button variant="dark" onClick={refreshPrice}>Refresh Price</Button>
                <h5>{hongReserve} DELI reserved</h5>
                <h5>{busdReserve} DELI(gov) reserved</h5>
                <h5>{totalSupplyHong} DELI in the world</h5>
                <h5>{totalSupplyBUSD} DELI(gov) in the world</h5>
                <h5>{totalSupplyLP} LP Token in the world</h5>
              </Col>
            </Row>
            <Row>
              <Col>
                <Card>
                  <Card.Body>
                    <Card.Title>Swap</Card.Title>
                    <Card.Subtitle>1 DELI(gov) to {amountIn} DELI</Card.Subtitle>
                    <Card.Subtitle>&nbsp;</Card.Subtitle>

                    <Card.Subtitle>1 DELI to {amountOut} DELI(gov)</Card.Subtitle>
                    <Card.Subtitle>&nbsp;</Card.Subtitle>


                    <Card.Subtitle>{quotedLPRatio} </Card.Subtitle>
                    <Card.Subtitle>&nbsp;</Card.Subtitle>
                    <ListGroup className="list-group-flush">
                      <ListGroupItem><Button variant="light" onClick={swapBUSDToHONG}>Put 0.1 DELI(gov) to get DELI </Button></ListGroupItem>
                      <ListGroupItem><Button variant="light" onClick={swapHONGToBUSD}>Put 0.1 DELI to get DELI(gov) </Button></ListGroupItem>
                      <ListGroupItem><Button variant="light" onClick={addLiquidityFunction}>Add 1:1 Liquidity</Button></ListGroupItem>
                      <ListGroupItem><Button variant="light" onClick={removeLiquidityFunction}>Remove 0.1:0.1 Liquidity</Button></ListGroupItem>
                    </ListGroup>
                  </Card.Body>
                </Card>
              </Col>
              <Col>
                <Card>
                  <Card.Body>
                    <Card.Title>DELI / DELI(gov) Liquidity Farm </Card.Title>
                    <Card.Subtitle>Rewards: DELI(gov)</Card.Subtitle>
                    <Card.Subtitle>&nbsp;</Card.Subtitle>
                    <Card.Subtitle>{farmInfo}</Card.Subtitle>
                    <Card.Subtitle>&nbsp;</Card.Subtitle>
                    <Card.Subtitle>{myFarmInfo}</Card.Subtitle>
                    <Card.Subtitle>&nbsp;</Card.Subtitle>
                    <Card.Subtitle>{pendingRewardInfo}</Card.Subtitle>
                    <ListGroup className="list-group-flush">
                      <ListGroupItem><Button variant="light" onClick={stake}>Stake 0.1 LP to Farm </Button></ListGroupItem>
                      <ListGroupItem><Button variant="light" onClick={unstake}>Unstake 0.1 LP to Farm </Button></ListGroupItem>
                    </ListGroup>
                  </Card.Body>
                </Card>
              </Col>
              <Col>
                <Card>
                  <Card.Body>
                    <Card.Title>DELI Lending Protocal </Card.Title>
                    <Card.Subtitle>Has {cash} DELI to provide</Card.Subtitle>
                    <Card.Subtitle>&nbsp;</Card.Subtitle>
                    <Card.Subtitle>Minted {totalSupplyLending} cDELI</Card.Subtitle>
                    <ListGroup className="list-group-flush">
                      <ListGroupItem><Button variant="light" onClick={refreshLending}>Refresh Price</Button></ListGroupItem>
                      <ListGroupItem><Button variant="light" onClick={supplyAssets}>Supply Assets</Button></ListGroupItem>
                      <ListGroupItem><Button variant="light" onClick={redeemAssets}>Redeem Assets</Button></ListGroupItem>
                    </ListGroup>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
            <Row>
              <Col>

                <h5><a target="_blank" rel="noreferrer" href={testnet_MY_CONTRACT}>View Factory Contract in Cronos Explorer</a></h5>
                <h5><a target="_blank" rel="noreferrer" href={testnet_MY_ROUTER_CONTRACT}>View Router Contract in Cronos Explorer</a></h5>
                <h5><a target="_blank" rel="noreferrer" href={testnet_MY_HONG_CONTRACT}>View DELI Contract in Cronos Explorer</a></h5>
                <h5><a target="_blank" rel="noreferrer" href={testnet_MY_BUSD_CONTRACT}>View DELI(gov) Contract in Cronos Explorer</a></h5>
                <h5><a target="_blank" rel="noreferrer" href={testnet_MY_LP_CONTRACT}>View Liquidity Pool Contract in Cronos Explorer</a></h5>
                <h5><a target="_blank" rel="noreferrer" href={testnet_MY_MASTERCHEF_CONTRACT}>View Liquidity Farm Contract in Cronos Explorer</a></h5>
                <h5><a target="_blank" rel="noreferrer" href={testnet_MY_SYRUP_CONTRACT}>View SENIOR Contract in Cronos Explorer</a></h5>
                <h5><a target="_blank" rel="noreferrer" href={testnet_MY_CAKE_CONTRACT}>View DELI(governance) Contract in Cronos Explorer</a></h5>
                <h5><a target="_blank" rel="noreferrer" href={GITHUB}>GitHub</a></h5>
              </Col>
            </Row>
          </Container>
        </header>
        </div>
  );
}

export default App;
