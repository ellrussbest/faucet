import { useCallback, useEffect, useState } from "react";
import "./App.css";
import Web3 from "web3";
import detectEthereumProvider from "@metamask/detect-provider";
import { loadContract } from "./utils/load-contract";

function App() {
  const [web3Api, setWeb3Api] = useState({
    provider: null,
    isProviderLoaded: false,
    web3: null,
    contract: null,
  });
  const [account, setAccount] = useState(null);
  const [balance, setBalance] = useState(null);
  const [shouldReload, setShouldReload] = useState(false);

  const reloadEffect = useCallback(
    () => setShouldReload(!shouldReload),
    [shouldReload]
  );

  const { web3, provider, contract, isProviderLoaded } = web3Api;

  const canConnectToContract = account && contract;

  const setAccountListener = (provider) => {
    provider.on("accountsChanged", () => window.location.reload());
    provider.on("chainChanged", () => window.location.reload());

    // // a lower level api that detects when metamask is unlocked
    // provider._jsonRpcConnection.events.on("notification", (payload) => {
    //   const { method } = payload;

    //   if (method === "metamask_unlockStateChanged") {
    //     setAccount(null);
    //   }
    // });
  };

  useEffect(() => {
    const loadProvider = async () => {
      // with metamask we have an access to window.ethereum & window.web3
      // metamask injects a global API into website
      // this API allows websites to request users, accounts, read data to blockchain

      // console.log(window.web3);
      // console.log(window.ethereum);

      const provider = await detectEthereumProvider();
      if (provider) {
        // let contract = null;
        const contract = await loadContract("Faucet", provider);

        // loadContract("Faucet", provider)
        //   .then((value) => {
        //     contract = value;
        //   })
        //   .catch((reason) => {
        //     console.error(reason);
        //   });

        setAccountListener(provider);

        setWeb3Api({
          provider,
          web3: new Web3(provider),
          contract,
          isProviderLoaded: true,
        });
      } else {
        setWeb3Api((web3Api) => {
          return {
            ...web3Api,
            isProviderLoaded: true,
          };
        });
        console.error("Please install Metamask");
      }

      /**
 * we can manually set our provider as seen, or we can use metamask detect 
 * provider utility as seen above
 * // checking if we have Ethereum metamask is installed
      if (window.ethereum) {
        provider = window.ethereum;

        try {
          await provider.request({ method: "eth_requestAccounts" });
        } catch {
          console.error("User denied accounts access");
        }
      }
      // for legacy applications we check for window.web3
      else if (window.web3) {
        provider = window.web3.currentProvider;
      }
      // we check if we are not in a production environment
      else if (!process.env.production) {
        provider = new Web3.providers.HttpProvider("http://localhost:7545");
      }
 * 
 */
    };

    loadProvider();
  }, []);

  useEffect(() => {
    const getAccount = async () => {
      // returns array of accounts
      const accounts = await web3.eth.getAccounts();
      setAccount(accounts[0]);
    };

    web3 && getAccount();
  }, [web3]);

  useEffect(() => {
    const loadBalance = async () => {
      const balance = await web3.eth.getBalance(contract.address);
      setBalance(web3.utils.fromWei(balance, "ether"));
    };

    contract && loadBalance();
  }, [web3Api, shouldReload]);

  /**
   * with a usecallback function
   * everytime the component is re-rendered, we're
   * creating new instance of addFunds, but with usecallback
   * we will be using the cached version of usecallback if nothing has
   * changed
   *
   * only with the change of web3Api we will create a new instance of this function
   */
  const addFunds = useCallback(async () => {
    await contract.addFunds({
      from: account,
      value: web3.utils.toWei("1", "ether"),
    });

    // when addfunds is executed, reloadEffect is also executed to toggle
    // shouldReload
    reloadEffect();
  }, [web3Api, account, reloadEffect]);

  const withdraw = async () => {
    const withdrawAmount = web3.utils.toWei("0.1", "ether");
    await contract.withdraw(withdrawAmount, { from: account });
    reloadEffect();
  };

  return (
    <>
      <div className="faucet-wrapper">
        <div className="faucet">
          {isProviderLoaded ? (
            <div className="is-flex is-align-items-center">
              <span>
                <strong className="mr-2">Account:</strong>
                {account ? (
                  <div>{account}</div>
                ) : !provider ? (
                  <>
                    <div className="notification is-warning is-small is-rounded">
                      Wallet is not detectected!{` `}
                      <a
                        target="_blank"
                        rel="noreferrer"
                        href="https://docs.metamask.io"
                      >
                        Install metamask
                      </a>
                    </div>
                  </>
                ) : (
                  <button
                    className="button is-size-6"
                    onClick={() => {
                      provider.request({ method: "eth_requestAccounts" });
                    }}
                  >
                    Connect Wallet
                  </button>
                )}
              </span>
            </div>
          ) : (
            <span>Looking for web3...</span>
          )}

          <div className="balance-view is-size-2 my-4">
            Current Balance: <strong>{balance}</strong> ETH
          </div>
          {!canConnectToContract && (
            <i className="is-block has-text-danger">Connect to Ganache</i>
          )}
          <button
            disabled={!canConnectToContract}
            className="button is-link mr-2"
            onClick={addFunds}
          >
            Donate 1eth
          </button>
          <button
            disabled={!canConnectToContract}
            className="button is-primary"
            onClick={withdraw}
          >
            Withdraw 0.1eth
          </button>
        </div>
      </div>
    </>
  );
}

export default App;
