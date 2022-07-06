import React, {useState} from "react";
import axios from 'axios'
import Snackbar from '@material-ui/core/Snackbar';
import Querystring from 'query-string'
import validator from 'validator'

import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import CircularProgress from '@material-ui/core/CircularProgress';

const ContactForm = (props) => {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [subject, setSubject] = useState("")
  const [message, setMessage] = useState("")

  const [updating, setUpdating] = useState(false)
  const [snackBarMessage, setSnackBarMessage] = useState("")
  const [openSnackbar, setOpenSnackbar] = useState(false)

  function sendMessage(){      
    if (!validator.isEmail(email)){
      setSnackBarMessage("Please input email correctly!")
      setOpenSnackbar(true)
      return
    }   
    setUpdating(true)        
    axios.post("/api/contact/sendmessage", Querystring.stringify({
      name: name,
      email:email,
      subject:subject,
      message:message
    }))
    .then(res => {            
      setUpdating(false)
      setSnackBarMessage("Sent the message successfully!")
      setDefaultData()
      setOpenSnackbar(true)                
    })
    .catch(err => {
      setUpdating(false)
      setSnackBarMessage(err.response.data)
      setOpenSnackbar(true)     
    })
  }
  function setDefaultData(){
    setName('');
    setEmail('');
    setSubject('');
    setMessage('');
  }

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') return;
    setOpenSnackbar(false);
  };

  return (    
    <div className="row justify-content-center">
      <div className="col-12 col-md-10 col-lg-8">
        <div className="contact_form">
          <form>
            <div className="row">
              <div className="col-12">
                  <div id="success_fail_info"></div>
              </div>

              <div className="col-12 col-md-6">
                <div className="group">
                  <p className="w-text mb-0">User Name</p>
                  <input type="text" name="role" id="role" value={name}
                    onChange={event => setName(event.target.value)}  />											
                </div>
              </div>
              <div className="col-12 col-md-6">
                <div className="group">
                  <p className="w-text mb-0">Email</p>
                  <input type="text" name="role" id="role" value={email}
                    onChange={event => setEmail(event.target.value)}  />											
                </div>
              </div>
              <div className="col-12 col-md-12">
                <div className="group">
                  <p className="w-text mb-0">Subject</p>
                  <input type="text" name="role" id="role" value={subject}
                    onChange={event => setSubject(event.target.value)}  />											
                </div>
              </div>

              <div className="col-12">
                <div className="group">
                  <p className="w-text mb-0">Message</p>
                  <textarea name="bio" id="bio" value={message}
                    onChange={event => setMessage(event.target.value)}></textarea>
                </div>
              </div>

              <div className="col-12 text-center" data-aos-delay='700' data-aos="fade-in">
                  <div className="more-btn" disabled={updating} onClick={() => sendMessage()}>
                  {
                    updating ? 
                      <CircularProgress style={{width: "16px", height: "16px", color: "white"}}/>
                      :
                      <>Send message</>
                  }
                  </div>
              </div>
            </div>
          </form>
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
    </div>    
  );
}

export default ContactForm;