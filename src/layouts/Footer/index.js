import React , {useState,useEffect} from "react";
import { useWeb3React } from '@web3-react/core'
import axios from 'axios'
import Snackbar from '@material-ui/core/Snackbar';
import Querystring from 'query-string'
import validator from 'validator'

import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';

import './footer.css'
import data from '../../data/data-layouts/data-Footer.json'


function Footer(){
	const [email, setEmail] = useState('') 
	const { account, library } = useWeb3React();

	const [updating, setUpdating] = useState(false)
	const [snackBarMessage, setSnackBarMessage] = useState("")
	const [openSnackbar, setOpenSnackbar] = useState(false)

	function subscribeEmail(){  		    
		if (!validator.isEmail(email)){
			setSnackBarMessage("Please input email correctly!")
			setOpenSnackbar(true)
			return
		}   
		if (account) {
			setUpdating(true)        
			axios.post("/api/contact/subscribe", Querystring.stringify({
				email:email,
				address:account.toLowerCase()
			}))
			.then(res => {            
				setUpdating(false)
				setSnackBarMessage("Subscribed email successfully!")
				setDefaultData()
				setOpenSnackbar(true)                
			})
			.catch(err => {
				setUpdating(false)
				setSnackBarMessage(err.response.data)
				setOpenSnackbar(true)     
			})
		}
		
	}
	function setDefaultData(){
		setEmail('');		
	}

	const handleClose = (event, reason) => {
		if (reason === 'clickaway') return;
		setOpenSnackbar(false);
	};

  return(
    <footer className="main-footer text-center">
		<div className="widgets-section padding-top-small padding-bottom-small">
		 <div className="container">
		     
		    <div className="row clearfix">
		       
		       <div className="footer-column col-md-4 col-sm-6 col-xs-12">
		          <div className="footer-widget about-widget">
		             <h3 className="has-line-center">About Us</h3>
		             <div className="widget-content">
		                <div className="text">Qubism is a crosschain NFT marketplace, where you can build your own 3D VR art gallery. </div>
							<ul className="social-links">	
								<li><a href="https://www.instagram.com/qubismnft/" target="_blank"><span className="fa fa-instagram"></span></a></li>	                   		
								<li><a href="https://twitter.com/QubismNFT" target="_blank"><span className="fa fa-twitter"></span></a></li>
								<li><a href="https://t.me/QubismNFTmarketplace" target="_blank"><span className="fa fa-telegram"></span></a></li>
								<li><a href="https://github.com/QubismNFT" target="_blank"><span className="fa fa-github"></span></a></li>
								<li><a href="https://www.linkedin.com/company/qubism/" target="_blank"><span className="fa fa-linkedin"></span></a></li>
								
							</ul>
		                 </div>
		             </div>
		         </div>
		         
		         
		         <div className="footer-column col-md-4 col-sm-6 col-xs-12">
		             <div className="footer-widget contact-widget">
		                 <h3 className="has-line-center">Contact Us</h3>
		                 <div className="widget-content">
		                     <ul className="contact-info">
		                         <li><div className="icon"><span className="flaticon-support"></span></div></li>
		                         {data[1].infoData && data[1].infoData.map((item , i) => (
		                         	<li key={i}>{item.text}</li>
		                         ))}
		                     </ul>
		                 </div>
		             </div>
		         </div>
		         
		         
		         <div className="footer-column col-md-4 col-sm-12 col-xs-12">
		             <div className="footer-widget newsletter-widget">
		                 <h3 className="has-line-center">Newsletter</h3>
		                 <div className="widget-content">
		                   <div className="text">Stay Updated with our latest news. We promise not to spam</div>
		                     <div className="newsletter-form">
		                         
								<div className="form-group">
									<input type="email" name="field-name" value={email} placeholder="Your Email" onChange={event => setEmail(event.target.value)} />
									<button className="send-btn" disabled={!account} onClick={() => subscribeEmail()}>
										<span className="fa fa-paper-plane-o"></span>
									</button>
								</div>
		                         
		                     </div>
		                 </div>
		             </div>
		         </div>
		         
		     </div>
		 </div>
		</div>
		<div className="footer-bottom">
		 <div className="auto-container">
		    <div className="copyright-text">Qubism copyright ©. All Rights Reserved</div>
		 </div>
		</div>
		<Snackbar
			anchorOrigin={{ vertical: 'bottom',  horizontal: 'left', }}
			open={openSnackbar}
			autoHideDuration={3000}
			onClose={handleClose}
			message={snackBarMessage}
			action={
				<React.Fragment>
				<IconButton size="small" aria-label="close" color="inherit" onClick={handleClose}>
					<CloseIcon fontSize="small" />
				</IconButton>
				</React.Fragment>
			}
        /> 
    </footer>
  )
}

export default Footer