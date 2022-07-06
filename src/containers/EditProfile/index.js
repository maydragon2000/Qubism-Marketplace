import React, {useState,useEffect} from "react";
import { useWeb3React } from '@web3-react/core'
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import CircularProgress from '@material-ui/core/CircularProgress';
import axios from 'axios'
import Snackbar from '@material-ui/core/Snackbar';

import { getImageIpfsHash } from "../../utils/ipfs";


import InfoComponent from '../../components/InfoComponent'
import PartProfile from "../../components/PartProfile"

import '../../assets/css/editProfile.css'

const EditProfileContainer = (props) => {
	const { user, login } = props;    
    const [userProfile, setUserProfile] = useState(undefined)
    const { account, active, chainId, library } = useWeb3React();
    const [updating, setUpdating] = useState(false)
    const [snackBarMessage, setSnackBarMessage] = useState("")
    const [openSnackbar, setOpenSnackbar] = useState(false)	
    
    const [newName, setNewName] = useState("")
	const [newRole, setNewRole] = useState("")
    const [newBio, setNewBio] = useState("")    

	const [profilePic, setProfilePic] = useState(null)
    const [profilePicHash, setProfilePicHash] = useState("");
    const [profilePicUploading, setProfilePicUploading] = useState(false);
    
    const [coverImgFile, setCoverImgFile] = useState(null)
    const [coverImgHash, setCoverImgHash] = useState("");
    const [coverImgUploading, setCoverImgUploading] = useState(false);
    

    useEffect(() => {
        if(!!user) {
          login();
        }
    }, [user, account, library])

    function updateProfile(){        
        setUpdating(true)
        const data = new FormData()
        data.append("address", account)
        data.append("name", newName || "NoName")
		data.append("role", newRole || "NoName")
        data.append("bio", newBio || "")
        data.append("profilePic", profilePicHash || "")
		data.append("coverImg", coverImgHash || "")

        axios.post("/api/user/update", data)
        .then(res => {            
            setUpdating(false)
            setSnackBarMessage("Success")
            setOpenSnackbar(true)  
            props.history.push(`/profile/${account}`)                  
        })
        .catch(err => {
            setUpdating(false)
            setSnackBarMessage(err.response.data.message)
            setOpenSnackbar(true)     
        })
    }

    useEffect(() => {        
        if (account && !userProfile){
          getUser()
        }        
    }, [user])

    function getUser(){
        axios.get(`/api/user/${account}`)
        .then(res => {            
          setUserProfile(res.data.user) 
          setProfilePicHash(res.data.user.profilePic)
		  setCoverImgHash(res.data.user.coverImg)
          setNewName(res.data.user.name)
		  setNewRole(res.data.user.role)
          setNewBio(res.data.user.bio)                 
        })
    }

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') return;
        setOpenSnackbar(false);
    };

    function handleProfilePic(event) {  
        console.log("handleProfilePic")      
        const fileType = event.target.files[0].type.split("/")[0]                
        if (fileType == "image") {
            const reader = new FileReader();
            setProfilePic(event.target.files[0])       
            reader.readAsArrayBuffer(event.target.files[0])
            setProfilePicUploading(true)
			setProfilePicHash(``)
            reader.onload = function(event) {
                const buffer = Buffer.from(reader.result);
                getImageIpfsHash(buffer).then((hash) => {
                    setProfilePicHash(`https://ipfs.io/ipfs/${hash}`)
                    setProfilePicUploading(false)
                })
            };
        }       
    }

	function handleCoverImg(event) {        
        const fileType = event.target.files[0].type.split("/")[0]
        if (fileType == "image") {
            const reader = new FileReader();
            setCoverImgFile(event.target.files[0])       
            reader.readAsArrayBuffer(event.target.files[0])
            setCoverImgUploading(true)
			setCoverImgHash(``)
            reader.onload = function(event) {
                const buffer = Buffer.from(reader.result);
                getImageIpfsHash(buffer).then((hash) => {
                    setCoverImgHash(`https://ipfs.io/ipfs/${hash}`)
                    setCoverImgUploading(false)
                })
            };
        }        
    }

	function closeProfilePic(){
        setProfilePic(null)
        setProfilePicHash("")
        setProfilePicUploading(false)        
    }

    function closeCoverImg(){        
        setCoverImgFile(null)
        setCoverImgHash("")
        setCoverImgUploading(false)        
    }

	

  return (
	<section className="blog-area section-padding-100">
		<div className="container">
			<InfoComponent
              titleSm='Edit Profile'
              titleLg=''              
            />
			<div className="row">		
				
				<div className="col-12 col-lg-4">
					<PartProfile
						name={newName}
						role={newRole}
						bio={newBio}
						profilePic={profilePicHash}
						coverImg={coverImgHash}		
						id={account}				      
					/>
				</div>
				<div className="col-12 col-lg-8">
					<div className="creator-sec dd-bg">        
						<div className="contact_form">
							<form action="#" method="post" id="main_contact_form" novalidate>
								<div className="row">
									<div className="col-12">
										<div id="success_fail_info"></div>
									</div>

									<div className="col-12 col-md-12 mb-15">
										<p className="w-text mb-0">Profile Logo</p>
										<div className="UploadContainer" style = {{display : profilePic? "none":""}}>
											<div className="UploadCaption">JPG, PNG, GIF, WEBP. Max 100mb</div>
											<div className="ChooseFileBtn">
												Choose File
												<input className="FileInput" type="file" value="" accept="image/*" onChange={handleProfilePic}/>
											</div>                    
										</div>
										<div className="PreviewContainer" style = {{display : profilePic? "":"none"}}>                     
											<div className="CloseIconContainer" style = {{display : profilePicHash ? "":"none"}}>                          
												<CloseIcon style={{color:'lightgrey'}} onClick={() => closeProfilePic()} fontSize="small" />
											</div>
											<div className="MediaContainer">  
												<CircularProgress style={{display : profilePicUploading ? "":"none", width: "30px", height: "30px", color: "red"}}/>                        
												<img className="ImagePreview" style = {{display : profilePicHash ? "":"none"}} src={profilePicHash}/>                        
											</div>                    
										</div>
									</div>

									<div className="col-12 col-md-12 mb-30">
										<p className="w-text mb-0">Cover Image</p>										
										<div className="UploadContainer" style = {{display : coverImgFile? "none":""}}>
											<div className="UploadCaption">JPG, PNG, GIF, WEBP. Max 100mb</div>
											<div className="ChooseFileBtn">
												Choose File
												<input className="FileInput" type="file" value="" accept="image/*" onChange={handleCoverImg}/>
											</div>                    
										</div>
										<div className="PreviewContainer" style = {{display : coverImgFile? "":"none"}}>                     
											<div className="CloseIconContainer" style = {{display : coverImgHash ? "":"none"}}>                          
												<CloseIcon style={{color:'lightgrey'}} onClick={() => closeCoverImg()} fontSize="small" />
											</div>
											<div className="MediaContainer">  
												<CircularProgress style={{display : coverImgUploading ? "":"none", width: "30px", height: "30px", color: "red"}}/>                        
												<img  className="ImagePreview" style = {{display : coverImgHash ? "":"none"}} src={coverImgHash}/>                        
											</div>                    
										</div>										
									</div>

									<div className="col-12 col-md-12">
										<div className="group">
											<p className="w-text mb-0">User name</p>
											<input type="text" value={newName} name="name" id="name"
												onChange={event => setNewName(event.target.value)} />											
										</div>
									</div>	

									<div className="col-12 col-md-12">
										<div className="group">
											<p className="w-text mb-0">User role</p>
											<input type="text" name="role" id="role" value={newRole}
												onChange={event => setNewRole(event.target.value)}  />											
										</div>
									</div>

									<div className="col-12">
										<div className="group">
											<p className="w-text mb-0">Bio</p>
											<textarea name="bio" id="bio" value={newBio}
												onChange={event => setNewBio(event.target.value)}></textarea>
										</div>
									</div>
									
									<div className="col-12 text-center">
										<div className="more-btn mb-15" >
											<div style={{display: updating ? "none" : "", color: "white"}} onClick={() => updateProfile()}>Update</div>
											<div style={{display: !updating ? "none" : ""}}>
												<CircularProgress style={{width: "16px", height: "16px", color: "white"}}/>
											</div>
										</div>
									</div>
								</div>
							</form>
						</div>
					</div>
				</div>			
			</div>
		</div>
		<Snackbar
			anchorOrigin={{
				vertical: 'bottom',
				horizontal: 'left',
			}}
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
	</section>
  );
}

export default EditProfileContainer;