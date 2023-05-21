import React from 'react';
import { Link } from 'react-router-dom';


const NavBar: React.FunctionComponent = (): JSX.Element => {
  return (  
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container">
        <Link to="/" className="navbar-brand">
          <img src="https://etherscan.io/images/svg/brands/ethereum-original.svg" width="38" height="38" alt="Ethereum" title="Ethereum Explorer"/>
        </Link>
        
        <Link to="/" className="navbar-brand">Ethereum Explorer</Link>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav">
            <li className="nav-item">
              <Link to="/block" className="nav-link">Search-Block</Link>
            </li>

            <li className="nav-item">
              <Link to="/transaction" className="nav-link">Search-Transaction</Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;