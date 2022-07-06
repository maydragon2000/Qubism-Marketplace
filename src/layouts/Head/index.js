import React, { useEffect } from "react";
import { useWeb3React } from '@web3-react/core'
import { NavLink } from "react-router-dom";

import "jquery-syotimer";

import { connectorLocalStorageKey, injectedConnector, walletconnect} from "../../utils/connectors"

// import './script.js'
import './navbar.css'
import {NavbarLogo} from '../../utils/allImgs'
import {Addshrink} from '../../utils'
import Preloader from '../../components/Preloader'
import UserIcon from "../../assets/img/icons/user.png";
import data from '../../data/data-layouts/data-Head.json'

function Head(props){
    const { Title, connectAccount } = props;
    const {account, active, chainId, deactivate} = useWeb3React();
    function signOut() {        
        deactivate(injectedConnector)  
        deactivate(walletconnect)     
        window.localStorage.setItem(connectorLocalStorageKey, "");
    }

    function connectWallet(){
        if (!account) {
            connectAccount();
        } else {
            signOut();
        }
    }  

    useEffect(() => {
        Addshrink()
    },[window.pageYOffset])

  return(
    <>
        <Preloader Title={Title} />
        <nav className="navbar navbar-expand-lg navbar-white fixed-top" id="banner">
            <div className="container">
                <NavLink className="navbar-brand" to="/"><span><img src={NavbarLogo} alt="logo" /></span></NavLink>

                <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#collapsibleNavbar">
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="collapsibleNavbar">
                    <ul className="navbar-nav ml-auto">
                        <li className="nav-item">
                            <NavLink className="nav-link" to="/">Home</NavLink>
                        </li>
                        <li className="nav-item dropdown">
                            <NavLink className="nav-link dropdown-toggle" to="#" data-toggle="dropdown">Explore</NavLink>
                            <div className="dropdown-menu">
                                {data[0].explore && data[0].explore.map((item , i) => (
                                    <NavLink key={i} className="dropdown-item" to={item.path}>{item.title}</NavLink>    
                                ))}
                            </div>
                        </li>
                        <li className="nav-item" style={{display: account? '':'none'}}>
                            <NavLink className="nav-link" to="/activity">Activity</NavLink>
                        </li>

                        <li className="nav-item" style={{display: account? '':'none'}}>
                            <NavLink className="nav-link" to="/createitem">Create</NavLink>
                        </li>                        
                        
                        <li className="nav-item">
                            <NavLink className="nav-link" to="/contact">Contact</NavLink>
                        </li>

                        <li className="nav-item">
                            <a href={"https://pancakeswap.finance/swap?outputCurrency=0xfbaad4efdb7797f45dac9cd369b03a90bd731298"} target="_blank" className="nav-link">Buy QUB</a>                           
                        </li>

                        <div className="nav-user-img-container" style={{display: account? '':'none'}}>
                            <NavLink to={`/profile/${account}`}>
                                <img src={props.user && props.user.profilePic ? props.user.profilePic : UserIcon } alt="" />
                            </NavLink>
                        </div>

                        <li className="lh-55px" onClick={() => { connectWallet()}}>
                            <div className="btn login-btn ml-15" >{account? 'Disconnect' : 'Connect Wallet'}</div>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    </>
  )
}

export default Head