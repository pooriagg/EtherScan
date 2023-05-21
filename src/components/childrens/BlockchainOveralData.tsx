import React, { useState, useEffect, useContext } from "react";
import ScaleLoader from 'react-spinners/ScaleLoader';

import Web3Context from "../../context/Web3Context";


const BlockchainOveralData: React.FunctionComponent = (): JSX.Element => {
    const { web3Https } = useContext(Web3Context);

    const [ loadingEther, setLoadingEther ] = useState<boolean>(true);
    const [ loadingGasPrice, setLoadingGasPrice ] = useState<boolean>(true);
    
    const [ ethData, setEthData ] = useState<any>();
    const [ gasPrice, setGasPrice ] = useState<number | string>(0);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const { market_data: { current_price: { usd: etherPrice }, market_cap: { usd: etherMarketCap } } } = await fetch("https://api.coingecko.com/api/v3/coins/ethereum", {
                    method: "GET",
                    headers: {
                        accepts: "application/json"
                    }
                }).then(res => res.json());

                const ethInfo = {
                    etherPrice,
                    etherMarketCap
                };

                setEthData(ethInfo);
                setLoadingEther(false);
            } catch (error) {
                console.warn("Failed to fetch eth data !\n", error);
            };
        };

        fetchData();
    }, []);
    
    useEffect(() => {
        const fetchData = async () => {
            setGasPrice(
                await web3Https?.eth.getGasPrice()!
            );
            
            setLoadingGasPrice(false);
        };

        fetchData();
    }, [ web3Https ]);

    return (
        <>
            <div className="col-6 mt-5 mb-2">
                <div className="card shadow">
                    <div className="card-header">
                        Ether Market Data
                    </div>
                        {
                            loadingEther ? (
                                <div className="col-1 mx-auto my-3">
                                    <ScaleLoader
                                        color="black"
                                        height={65}
                                        width={3}
                                    />
                                </div>
                            ) : (
                                <>
                                    <div className="card-body">
                                        <div className="container">
                                            <div className="row text-center">
                                                <div className="col-4">
                                                    Price - { Number(ethData["etherPrice"]).toLocaleString() + " $" }
                                                </div>
                
                                                <div className="col-7 mx-auto">
                                                    Market Capital - { Number(ethData["etherMarketCap"]).toLocaleString() + " $" }
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </>
                            )
                        }
                </div>
            </div>

            <div className="col-6 my-5">
                <div className="card shadow">
                    <div className="card-header">
                        Gas Price
                    </div>
                    {
                        loadingGasPrice ? (
                            <div className="col-1 mx-auto my-3">
                                <ScaleLoader
                                    color="black"
                                    height={65}
                                    width={3}
                                />
                            </div>
                        ) : (
                            <>     
                                <div className="card-body">
                                    <div className="container">
                                        <div className="row text-center">
                                            <div className="col-12">
                                                Gas Price - { Number(
                                                    web3Https?.utils.fromWei(
                                                        String(gasPrice), "gwei"
                                                    )
                                                ).toLocaleString() + " gwei" }
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </>
                        )
                    }
                </div>
            </div>
        </>
    );
};

export default BlockchainOveralData;