import React, { useMemo } from 'react';
import { Routes, Route, Navigate } from "react-router-dom";
import Web3 from "web3";

import Web3Context from './context/Web3Context';

import NavBar from './components/NavBar';
import Data from './components/Data';
import SearchBlock from './components/SearchBlock';
import SearchTx from './components/SearchTx';


const App: React.FunctionComponent = (): JSX.Element => {
  const web3Https = useMemo(() => new Web3(
    new Web3.providers.HttpProvider(
      "<API_KEY>"
    )
  ), []);

  return (
    <Web3Context.Provider
      value={{
        web3Https
      }}
    >
      <NavBar />

      <Routes>
        <Route path='/' element={<Navigate to="explorer"/>}/>
        <Route path='/explorer' element={<Data />}/>
        <Route path='/block' element={<SearchBlock />}/>
        <Route path='/transaction' element={<SearchTx />}/>
        <Route path='*' element={<h1>Error 404 - Not Found</h1>}/>
      </Routes>
    </Web3Context.Provider>
  );
};

export default App;
