import { createContext } from "react";
import Web3 from "web3";


interface IWeb3 {
    web3Https?: Web3,
    web3Wss?: Web3,
    waitForTx?: (txHash: string, web3Provider: Web3) => Promise<void>
};

const Web3Context = createContext<IWeb3>({});

export default Web3Context;