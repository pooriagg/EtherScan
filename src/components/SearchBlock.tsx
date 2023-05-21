import React, { useState, useContext, useCallback } from 'react';
import ScaleLoader from 'react-spinners/ScaleLoader';

import Web3Context from '../context/Web3Context';


const SearchBlock: React.FunctionComponent = (): JSX.Element => {
  const { web3Https } = useContext(Web3Context);

  const [ loading, setLoading ] = useState<boolean>(false);
  const [ error, setError ] = useState<boolean>(false);
  const [ blockNumber, setBlockNumber ] = useState<number | null>(null);
  const [ blockData, setBlockData ] = useState<any>();

  const fetchBlockData = useCallback(async (blockNum: number): Promise<void> => {
    try {
      setBlockData(undefined);
      setError(false);
      setLoading(true);

      const block = await web3Https?.eth.getBlock(blockNum, false);

      setBlockData(block);
      setLoading(false);
    } catch (error) {
      console.warn("Error occured while trying to fetch the block data !\n", error);

      setError(true);
      setBlockData(undefined);
      setLoading(false);
    };
  }, [ web3Https ]);
  
  return (
    <div className="container">
      <div className="row mt-5 mb-2 text-center">
        <div className="col-6 mx-auto">
          {
            error ? (
              <div className="alert alert-warning text-center mt-2">
                Error occured while trying to fetch block data
              </div>
            ) : (null)
          }

          <div className="card">
            <div className="card-header">
              Search Block
            </div>

            <div className="card-body">
              <form>
                <input type="number" onChange={e => {
                  setBlockData(undefined);

                  const number = Number(e.target.value);

                  setBlockNumber(
                    !isNaN(number) ? number : null
                  );
                }} min="0" placeholder="Enter block number" id="blockNumber" className="form-control mb-3"/>

                <button type="button" className="btn btn-primary btn-block form-control" id="btn-search-block" onClick={async () => {
                  if (blockNumber !== null) {
                    await fetchBlockData(blockNumber);
                  } else {
                    setError(true);
                    console.warn("Please enter block number !");
                  };
                }}>
                  Fetch Block Data
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
          blockData ? (
            <div className="col-7 mx-auto my-5">
              <div className="card">
                <div className="card-header" title="click to copy full data" onClick={async () => {
                  await window.navigator.clipboard.writeText(
                    JSON.stringify(blockData)
                  ).then(() => console.log("Copied!"));
                }}>
                  Block Number '{ blockNumber }'
                </div>
    
                <div className="card-body">
                  <strong>Hash</strong> <p className='mt-1'>{ blockData["hash"] }</p> <hr />

                  <strong>Number</strong> <p className='mt-1'>{ Number(blockData["number"]).toLocaleString() }</p> <hr />

                  <strong>Miner</strong> <p className='mt-1'>{ blockData["miner"] }</p> <hr />

                  <strong>Size</strong> <p className='mt-1'>{ Number(blockData["size"]).toLocaleString() + " bytes" }</p> <hr />

                  <strong>Parent Hash</strong> <p className='mt-1'>{ blockData["parentHash"] }</p> <hr />

                  <strong>Timestamp</strong> <p className='mt-1'>{ (new Date(blockData["timestamp"] * 1000)).toLocaleString() }</p> <hr />

                  <strong>Gas Limit</strong> <p className='mt-1'>{ Number(blockData["gasLimit"]).toLocaleString() }</p> <hr />

                  <strong>Gas Used</strong> <p className='mt-1'>{ Number(blockData["gasUsed"]).toLocaleString() }</p> <hr />

                  <strong>Total Difficulty</strong> <p className='mt-1'>{ Number(blockData["totalDifficulty"]).toLocaleString() }</p> <hr />

                  <strong>Logs Bloom</strong> <p className='mt-2'> <button className='btn btn-info' title="click to copy" onClick={async () => {
                  await window.navigator.clipboard.writeText(
                    JSON.stringify(blockData["logsBloom"])
                  ).then(() => console.log("Copied!"));
                }}>logs</button> </p> <hr />

                  <strong>Transactions</strong> <p className='mt-2'> <button className='btn btn-info' title="click to copy" onClick={async () => {
                  await window.navigator.clipboard.writeText(
                    JSON.stringify(blockData["transactions"])
                  ).then(() => console.log("Copied!"));
                }}>transactions</button> </p>
                </div>
              </div>
            </div>
          ) : (null)
        }          
      </div>
    </div>
  );
};

export default SearchBlock;