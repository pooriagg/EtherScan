import React, { useContext, useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import ScaleLoader from 'react-spinners/ScaleLoader';

import Web3Context from '../../context/Web3Context';


const HttpsTxs: React.FunctionComponent = (): JSX.Element => {
  const { web3Https } = useContext(Web3Context);

  const [ loading, setLoading ] = useState<boolean>(true);
  const [ txs, setTxs ] = useState<any[]>([]);
  const [ update, setUpdate ] = useState<boolean>(false);

  useEffect(() => {
    web3Https?.eth.getBlockNumber(async (err, latestBlock) => {
      if (!err) {
        let txsData = [];
        let permission = true;
        let blockNumber = latestBlock;

        while (permission) {
          const { transactions } = await web3Https.eth.getBlock(blockNumber, true);

          for (const tx of transactions) {
            if (txsData.length === 15) {
              permission = false;
              break;
            };

            txsData.push(tx);
          };

          blockNumber -= 1; 
        };

        if (txsData.length) {
          setTxs(txsData);
          setLoading(false);
        };

        setTimeout(() => {
          setUpdate(!update);
        }, 15000);
      } else {
        console.warn("Failed to fetch transactions data !");
      };
    });
  }, [ web3Https, update ]);

  const trimAddress = useCallback((addr: string): string => {
    return `${addr.slice(0, 25)}...`;
  }, []);

  return (
    <div className="card shadow">
      <div className="card-header">
        Latest Transactions
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
                    <th scope="col">tx hash</th>
                    <th scope="col">gas used</th>
                    <th scope="col">value</th>
                  </tr>
                </thead>
                <tbody>
                  {
                    !loading && txs.length ? (
                      txs.map((tx, index) => (
                        <tr key={index}>
                          <td style={{
                            cursor: "pointer"
                          }} title={tx.hash + " - click to copy"} onClick={async () => {
                            await window.navigator.clipboard.writeText(tx.hash).then(() => {
                              console.log("Copied!");
                            });
                          }}>{ trimAddress(tx.hash) }</td>
                          <td>{ Number(tx.gas).toLocaleString() }</td>
                          <td>{ Number(Number(
                            web3Https?.utils.fromWei(
                              String(tx.value), "ether"
                            )
                          ).toFixed(3)).toLocaleString() + " ether" }</td>
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

export default HttpsTxs;