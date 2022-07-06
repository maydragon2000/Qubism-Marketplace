import React from 'react';
import ReactDOM from 'react-dom';
import { Web3ReactProvider } from '@web3-react/core'
import { Web3Provider } from '@ethersproject/providers'
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from './context/authContext';

import App from './App';
import reportWebVitals from './reportWebVitals';

function getLibrary(provider) {
    const library = new Web3Provider(provider)
    library.pollingInterval = 12000
    return library
}

ReactDOM.render(
	<Web3ReactProvider getLibrary={getLibrary}>
      	<AuthProvider>
			<BrowserRouter>
				<App />
			</BrowserRouter>
      	</AuthProvider>
    </Web3ReactProvider>,
  document.getElementById('root')
);

reportWebVitals();
