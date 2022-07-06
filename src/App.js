import React, { useState, useEffect } from "react";
import { Switch, BrowserRouter as Router, Route } from "react-router-dom";
import { useWeb3React } from '@web3-react/core'
import { Modal } from '@material-ui/core';
import Button from '@material-ui/core/button';
import { makeStyles } from '@material-ui/core/styles';
import {Helmet} from "react-helmet";
import Aos from 'aos'

import { connectors, connectorLocalStorageKey } from './utils/connectors'
import { useEagerConnect } from "./hooks/useEagerConnect"
import { useInactiveListener } from "./hooks/useInactiveListener"
import { useAxios } from "./hooks/useAxios";
import { getErrorMessage } from "./utils/ethereum";

import { getUser, loginUser, useAuthDispatch, useAuthState } from "./context/authContext";

import {
    Activity,
    Auctions,
    Contact,
    CreateItem,
    Listed,
    Explore,
    Home,
    ItemDetails,
    EditProfile,
    Profile,    
} from './pages'

import 'aos/dist/aos.css';
import './assets/css/bootstrap.min.css'
import './assets/css/global.css'
// import '../../assets/css/style.css';
// import './global.css';

import 'bootstrap/dist/js/bootstrap.bundle.min';

const App = () => {
  useEffect(() => {
    Aos.init({
      duration: 1000
      })
  },[])

  const [connectModalOpen, setConnectModalOpen] = useState(null);
  const [errorModalOpen, setErrorModalOpen] = useState(null);
  const [networkError, setNetworkError] = useState(null);

  function getModalStyle() {
    const top = 50
    const left = 50  
    return {
      top: `${top}%`,
      left: `${left}%`,
      borderRadius: '10px',
      transform: `translate(-${top}%, -${left}%)`,
    };
  }
  const useStyles = makeStyles((theme) => ({
    paper: {
      position: 'absolute',
      width: 300,
      backgroundColor: theme.palette.background.paper,
      boxShadow: theme.shadows[5],
      padding: theme.spacing(3, 4, 3),
    },
  }));

  const classes = useStyles();
  const [modalStyle] = React.useState(getModalStyle);

  useAxios();

  const {chainId, account, library, activate, active, connector, error} = useWeb3React();
  const connectAccount = () => {
    setConnectModalOpen(true)
  }  
  const connectToProvider = (connector) => {
    activate(connector)
  }

  // handle logic to recognize the connector currently being activated
  const [activatingConnector, setActivatingConnector] = React.useState()
  useEffect(() => {
      if (activatingConnector && activatingConnector === connector) {
          setActivatingConnector(undefined)
      }
  }, [activatingConnector, connector])

  // mount only once or face issues :P
  const [triedEager, triedEagerError] = useEagerConnect()
  const { activateError } = useInactiveListener(!triedEager || !!activatingConnector)

  // handling connection error
  if((triedEagerError || activateError) && errorModalOpen === null) {
      const errorMsg = getErrorMessage(triedEagerError || activateError);
      setNetworkError(errorMsg);
      setErrorModalOpen(true);
  }

  const dispatch = useAuthDispatch();
  const { user, token } = useAuthState();

  const login = async () => {
    if(!account || !library) {
      console.log('not connected to wallet')
      return;
    }
    if(!user) {
      console.log('fetching user')
      await getUser(dispatch, account);
    }
    if(!user?.nonce || token) {
      console.log('nonce is invalid or already logged in')
      return;
    }
    console.log("login 2")
    loginUser(dispatch, account, user?.nonce, library.getSigner())
  }

  useEffect(() => {      
    if (active && account && !user){
      getUser(dispatch, account)
    }
  }, [active, account])

  const closeErrorModal = () => {
    window.localStorage.setItem(connectorLocalStorageKey, connectors[0].key);
    window.location.reload();
  }

  return (    
    	<div className="App">
        <Helmet>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
          <title>
            NFT Marketplace
          </title>
          <link href="https://fonts.googleapis.com/css?family=Open+Sans:300,400,600,700" rel="stylesheet" />
          <link rel="stylesheet" type="text/css" href="https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css" />
        </Helmet>

        <Router>
          <Switch>
            <Route path="/" exact render={(props) => (<Home {...props} user={user} connectAccount={connectAccount}/>)} />
            <Route path="/home" exact render={(props) => (<Home {...props} user={user} connectAccount={connectAccount}/>)} />
            <Route path="/activity" exact render={(props) => (<Activity {...props} user={user} connectAccount={connectAccount}/>)} />
            <Route path="/contact" exact render={(props) => (<Contact {...props} user={user} connectAccount={connectAccount}/>)} />
            <Route path="/createitem" exact render={(props) => (<CreateItem {...props} user={user} connectAccount={connectAccount}/>)} />
            <Route path="/explore" exact render={(props) => (<Explore {...props} user={user} connectAccount={connectAccount}/>)} component={Explore} />
            <Route path="/auctions" exact render={(props) => (<Auctions {...props} user={user} connectAccount={connectAccount}/>)} />
            <Route path="/listed" exact render={(props) => (<Listed {...props} user={user} connectAccount={connectAccount}/>)} />          
            <Route path="/itemDetails/:collection/:tokenId" exact render={(props) => (<ItemDetails {...props} user={user} getUser={getUser} login={login} connectAccount={connectAccount}/>)} />
            <Route path="/editProfile" exact render={(props) => (<EditProfile {...props} user={user} getUser={getUser} login={login} connectAccount={connectAccount}/>)} />
            <Route path="/profile/:address" exact render={(props) => (<Profile {...props} user={user}  getUser={getUser} login={login} connectAccount={connectAccount}/>)} />          
          </Switch>
        </Router>

        <Modal
          disableBackdropClick
          disableEscapeKeyDown
          open={!!errorModalOpen && !active}
          onClose={() => {setErrorModalOpen(false)}}
          aria-labelledby="simple-modal-title"
          aria-describedby="simple-modal-description"
          >
          <div style={modalStyle} className={`${classes.paper} modal-div`}>
            <div style={{textAlign: 'center'}}>
              <p style={{color: 'black'}}>{networkError}</p>
            </div>             
            <div style={{textAlign: 'center'}}>
              <div className="btn more-btn mt-10" onClick={() => {window.location.reload()}} variant="contained" color="primary">Close</div>
            </div>                        
          </div>

        </Modal>
        <Modal
          disableBackdropClick
          disableEscapeKeyDown
          open={!!connectModalOpen}
          onClose={() => {setConnectModalOpen(false)}}
          aria-labelledby="simple-modal-title"
          aria-describedby="simple-modal-description"
          >
          <div style={modalStyle} className={`${classes.paper} modal-div`}>
            <div className={`connectors-wrapper`} style = {{display : 'grid'}}>
            {
              connectors.map((entry, index) => (
                <Button
                  key={index}
                  variant="outlined"
                  onClick={() => {
                    connectToProvider(entry.connectorId);
                    window.localStorage.setItem(connectorLocalStorageKey, entry.key);
                    setConnectModalOpen(false)                               
                  }}
                  className="connect-button textPrimary"
                  color="primary"
                  style={{color: 'red', marginBottom: '10px'}}
                  endIcon={<entry.icon width="30"/>}
                  id={`wallet-connect-${entry.title.toLocaleLowerCase()}`}
                >
                {entry.title}
                </Button>
              ))}
            </div>
            <div style={{textAlign: 'center'}}>
              <div className="btn more-btn mt-20" onClick={() => {setConnectModalOpen(false)}} variant="contained" color="primary">Close</div>
            </div>
            
          </div>
        </Modal>

	    </div>  	
  );
}

export default App;