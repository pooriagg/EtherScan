import React, { useState, useContext, useCallback } from 'react';
import ScaleLoader from 'react-spinners/ScaleLoader';

import Web3Context from '../context/Web3Context';


const SearchTx: React.FunctionComponent = (): JSX.Element => {
  const { web3Https } = useContext(Web3Context);

  const [ loading, setLoading ] = useState<boolean>(false);
  const [ error, setError ] = useState<boolean>(false);
  const [ txHash, setTxHash ] = useState<string | null>(null);
  const [ txData, setTxData ] = useState<any>();

  const fetchTxData = useCallback(async (transactionHash: string): Promise<void> => {
    try {
      setError(false);
      setLoading(true);
      setTxData(undefined);

      if (
        transactionHash.length === 66 &&
        transactionHash.startsWith("0x") &&
        web3Https?.utils.isHexStrict(transactionHash)
      ) {
        const tx = await web3Https?.eth.getTransactionReceipt(transactionHash);

        if (tx == null) {
          throw new Error("Transaction is not mined yet.");
        };

        const tx_2 = await web3Https.eth.getTransaction(transactionHash);
        const interactedWithContracts = await web3Https?.eth.getCode(tx!.to!);
        const { timestamp } = await web3Https.eth.getBlock(tx_2.blockNumber!, false);
        const txFinalData = {
          ...tx,
          interacted: (interactedWithContracts !== "0x" && interactedWithContracts?.length! > 2) ? true : false,
          gas: tx_2.gas,
          gasPrice: tx_2.gasPrice,
          input: tx_2.input,
          nonce: tx_2.nonce,
          value: tx_2.value,
          timestamp
        };

        setLoading(false);
        setTxData(txFinalData);
      } else {
        throw new Error("Invalid transaction hash.");
      };
    } catch (error) {
      console.warn("Error occured while trying to fetch tx data !\n", error);

      setError(true);
      setLoading(false);
    };
  }, [ web3Https ]);

  const giveStatus = useCallback((state: boolean): JSX.Element => {
    return state ? <span className='badge bg-success'>Success</span> : <span className='badge bg-danger'>Failed</span>;
  }, []);
  

  return (
    <div className="container">
      <div className="row mt-5 mb-2 text-center">
        <div className="col-6 mx-auto">
          {
            error ? (
              <div className="alert alert-warning text-center mt-2">
                Error occured while trying to fetch Transaction data
              </div>
            ) : (null)
          }

          <div className="card">
            <div className="card-header">
              Search Transaction
            </div>

            <div className="card-body">
              <form>
                <input type="text" placeholder="Enter transaction hash" id="transaction-hash" className="form-control mb-3" onChange={e => {
                  setTxHash(e.target.value);
                }}/>

                <button type="button" className="btn btn-primary btn-block form-control" id="btn-search-block" onClick={async () => {
                  if (txHash !== null) {
                    await fetchTxData(txHash);
                  } else {
                    console.warn("Please enter a tx hash !");
                  };
                }}>
                  Fetch Transaction Data
                </button>
              </form>
            </div>
          </div>
        </div>

        {
          loading ? (
            <div className="col-7 mx-auto mt-5">
              <ScaleLoader
                color="black"
                height={65}
                width={5}
              />
            </div>
          ) : (null)
        }

        {
          txData ? (
            <div className="col-7 mx-auto my-5">
              <div className="card">
                <div className="card-header" title="click to copy full data" onClick={async () => {
                    await window.navigator.clipboard.writeText(JSON.stringify(txData)).then(() => {
                      console.log("Copied!");
                    });
                  }}>
                  Transaction details
                </div>
    
                <div className="card-body">
                  <strong>Hash</strong> <p className='mt-1'>{ txData["transactionHash"] }</p> <hr />

                  <strong>Status</strong> <p className='mt-1'>{ giveStatus(txData["status"]) }</p> <hr />

                  <strong>From</strong> <p className='mt-1'>{ web3Https?.utils.toChecksumAddress(txData["from"]) }</p> <hr />

                  <strong>To</strong> <p className='mt-1'>{ web3Https?.utils.toChecksumAddress(txData["to"]) }</p> <hr />

                  <strong>Nonce</strong> <p className='mt-1'>{ Number(txData["nonce"]).toLocaleString() }</p> <hr />

                  <strong>Transaction index</strong> <p className='mt-1'>{ txData["transactionIndex"] }</p> <hr />

                  <strong>Block Number</strong> <p className='mt-1'>{ Number(txData["blockNumber"]).toLocaleString() }</p> <hr />

                  <strong>Block Hash</strong> <p className='mt-1'>{ txData["blockHash"] }</p> <hr />

                  <strong>Value</strong> <p className='mt-1'>{ Number(web3Https?.utils.fromWei(
                    txData["value"],
                    "ether"
                  )).toLocaleString() + " ether" }</p> <hr />

                  <strong>Interaction With</strong> <p className='mt-1'>{ txData["interacted"] ? "Smart-Contract" : "EOA" }</p> <hr />

                  <strong>Contract Address</strong> <p className='mt-1'>{ txData["contractAddress"] === null ? "Nothing-Deployed" : "Deployed" }</p> <hr />

                  <strong>Timestamp</strong> <p className='mt-1'>{ (new Date(txData["timestamp"] * 1000)).toLocaleString() }</p> <hr />

                  <strong>Gas Limit</strong> <p className='mt-1'>{ Number(txData["gas"]).toLocaleString() + " unit" }</p> <hr />

                  <strong>Gas Price</strong> <p className='mt-1'>{ Number(Number(web3Https?.utils.fromWei(
                    txData["gasPrice"],
                    "gwei"
                  )).toFixed(3)).toLocaleString() + " gwei" }</p> <hr />

                  <strong>Input</strong> <p className='mt-1'>{ txData["input"] }</p> <hr />

                  <strong>Logs</strong> <p className='mt-2'> <button className='btn btn-info' title="click to copy" onClick={async () => {
                    await window.navigator.clipboard.writeText(JSON.stringify(txData["logs"])).then(() => {
                      console.log("Copied!");
                    });
                  }}>logs</button> </p>
                </div>
              </div>
            </div>
          ) : (null)
        }          
      </div>
    </div>
  );
};

export default SearchTx;