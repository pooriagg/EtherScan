import React, { useContext, useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import ScaleLoader from 'react-spinners/ScaleLoader';

import Web3Context from '../../context/Web3Context';


const HttpsBlocks: React.FunctionComponent = (): JSX.Element => {
  const { web3Https } = useContext(Web3Context);

  const [ loading, setLoading ] = useState<boolean>(true);
  const [ blocks, setBlocks ] = useState<any[]>([]);
  const [ update, setUpdate ] = useState<boolean>(false);

  useEffect(() => {
    web3Https?.eth.getBlockNumber(async (err, latestBlock) => {
      if (!err) {
        let data = [];
        
        for (let block = latestBlock - 14; block <= latestBlock; block++) {
          data.push(
            await web3Https.eth.getBlock(block)
          );
        };

        if (data.length) {
          setBlocks(data);
          setLoading(false);
        };

        setTimeout(() => {
          setUpdate(!update);
        }, 20000);
      } else {
        console.warn("Failed to fetch the blocks !");
      };
    });
  }, [ web3Https, update ]);

  const trimAddress = useCallback((addr: string): string => {
    return `${addr.slice(0, 20)}...`;
  }, []);

  return (
    <div className="card shadow">
      <div className="card-header">
        Latest Blocks
      </div>

      <div className="card-body">
        {
          loading ? (
            <div className="col-1 mx-auto mt-1">
                <ScaleLoader
                    color="black"
                    height={65}
                    width={3}
                />
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr>
                    <th scope="col">block number</th>
                    <th scope="col">miner</th>
                    <th scope="col">block size</th>
                  </tr>
                </thead>
                <tbody>
                  {
                    !loading && blocks.length ? (
                      blocks.map((block, index) => (
                        <tr key={index}>
                          <td style={{
                            cursor: "pointer"
                          }} title="click to copy" onClick={async () => {
                            await window.navigator.clipboard.writeText(block.number).then(() => {
                              console.log("Copied!");
                            });
                          }}>{ Number(block.number).toLocaleString() }
                          </td>
                          <td title={block.miner}>{ trimAddress(block.miner) }</td>
                          <td>{ Number(block.size).toLocaleString() + " bytes" }</td>
                        </tr>
                      ))
                    ) : (null)
                  }
                </tbody>
              </table>
            </div>
          )
        }
      </div>
    </div>
  );
};

export default HttpsBlocks;