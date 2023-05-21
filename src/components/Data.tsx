import React from 'react';

import BlockchainOveralData from './childrens/BlockchainOveralData';
import HttpsBlocks from './childrens/HttpsBlocks';
import HttpsTxs from './childrens/HttpsTxs';


const Data: React.FunctionComponent = (): JSX.Element => {
  return (
    <div className="container">
      <div className="row mb-3 mt-2 text-center">
        <BlockchainOveralData />

        <div className="col-6">
          <HttpsBlocks />
        </div>
          
        <div className="col-6">
          <HttpsTxs />
        </div>
      </div>
    </div>
  );
};

export default Data;