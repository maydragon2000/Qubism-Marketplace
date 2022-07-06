import React, {useState,useEffect} from "react";
import { useWeb3React } from '@web3-react/core'
import { NavLink } from "react-router-dom";
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import CircularProgress from '@material-ui/core/CircularProgress';
import axios from 'axios'
import Snackbar from '@material-ui/core/Snackbar';

import { getImageIpfsHash } from "../../utils/ipfs";
import { addItem, createNewCollection } from "../../utils/contracts";
import bgImg from "../../assets/img/bg-img/bread.png";

import InfoComponent from '../../components/InfoComponent'
import '../../assets/css/createItem.css'
import Modal from "react-modal";
import * as S from "./styles";

const CreateItemContainer = (props) => {
	const { account, active, chainId, library } = useWeb3React();
	const [userProfile, setUserProfile] = useState(undefined)

	const [snackBarMessage, setSnackBarMessage] = useState("")
    const [openSnackbar, setOpenSnackbar] = useState(false)

	const [mainFile, setMainFile] = useState(null)
    const [mainFileHash, setMainFileHash] = useState("");
    const [mainFileUploading, setMainFileUploading] = useState(false);
    const [showCoverUpload, setShowCoverUpload] = useState(false);
    
    const [coverImgFile, setCoverImgFile] = useState(null)
    const [coverImgHash, setCoverImgHash] = useState("");
    const [coverImageUploading, setCoverImageUploading] = useState(false);
    const [mediaType, setMediaType] = useState("");   
    
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [royalty, setRoyalty] = useState(5);
    const [category, setCategory] = useState("");
    const [selectedCollection, setSelectedCollection] = useState(null);
    const [collections, setCollections] = useState([]);
    const [categories, setCategories] = useState([]);
    const [creatingItem, setCreatingItem] = useState(false);

	const [showCreateCollectionDlg, setShowCreateCollectionDlg] = useState(false)
    const [collectionFile, setCollectionFile] = useState(null)
    const [collectionImgHash, setCollectionImgHash] = useState("");
    const [collectionImgUploading, setCollectionImgUploading] = useState(false);  
    const [newCollectionName, setNewCollectionName] = useState("");
    const [creatingCollection, setCreatingCollection] = useState(false);

    const handleCloseDialog = (event, reason) => {
        if (reason === 'clickaway') return;
        setOpenSnackbar(false);
    };

    useEffect(() => {        
        if (!userProfile && account){
          getUser()
        }        
    }, [account])

    function getUser(){
        axios.get(`/api/user/${account ? account : ""}`)
        .then(res => {
          setUserProfile(res.data.user)                
        })
    }

	useEffect(() => {
        if (categories.length === 0) fetchCategories();
    }, [categories]);

    function fetchCategories() {        
        axios.get(`/api/categories`)
        .then((res) => {            
            setCategories(res.data.categories);  
            setCategory(res.data.categories[0].name)                 
        })
        .catch((err) => {
            console.log("err: ", err.message);
            setCategories([]);
        });
    }

	useEffect(() => {
        if (account && collections.length === 0) fetchCollections();
    }, [account, selectedCollection]);

	function fetchCollections() {        
        axios.get(`/api/collection?owner=${account}`)
        .then((res) => {
            console.log("res: ", res);
            setCollections(res.data.collections);
            res.data.collections.forEach((item, i) => {
                if (item.name === "Qubism") {
                    setSelectedCollection(item);
                }
            });
        })
        .catch((err) => {
            console.log("err: ", err.message);
            setCollections([]);
        });
    }



    function handleMainFile(event) {  
        console.log("handleMainFile")      
        const fileType = event.target.files[0].type.split("/")[0]                
        if (fileType === "image") {
            setMediaType(fileType)
            setCoverImgFile(null)
            setCoverImgHash("")
            setShowCoverUpload(false)
            const reader = new FileReader();
            setMainFile(event.target.files[0])       
            reader.readAsArrayBuffer(event.target.files[0])
            setMainFileUploading(true)
            reader.onload = function(event) {
                const buffer = Buffer.from(reader.result);
                getImageIpfsHash(buffer).then((hash) => {
                    setMainFileHash(`https://ipfs.io/ipfs/${hash}`)
                    setCoverImgHash(`https://ipfs.io/ipfs/${hash}`)
                    setMainFileUploading(false)
                    setCoverImageUploading(false)
                })
            };
        } else if ((fileType === "video") || (fileType === "audio") ) {            
            const reader = new FileReader();
            setMainFile(event.target.files[0])       
            reader.readAsArrayBuffer(event.target.files[0])
            setMainFileUploading(true)
            reader.onload = function(event) {
                const buffer = Buffer.from(reader.result);
                getImageIpfsHash(buffer).then((hash) => {
                    setMainFileHash(`https://ipfs.io/ipfs/${hash}`)
                    setMainFileUploading(false)
                    setMediaType(fileType)
                    setShowCoverUpload(true)
                })
            };
        }        
    }
    function handleCoverImg(event) {        
        const fileType = event.target.files[0].type.split("/")[0]
        if (fileType === "image") {
            const reader = new FileReader();
            setCoverImgFile(event.target.files[0])       
            reader.readAsArrayBuffer(event.target.files[0])
            setCoverImageUploading(true)
            reader.onload = function(event) {
                const buffer = Buffer.from(reader.result);
                getImageIpfsHash(buffer).then((hash) => {
                    setCoverImgHash(`https://ipfs.io/ipfs/${hash}`)
                    setCoverImageUploading(false)
                })
            };
        }        
    }
	function handleCollectionImg(event) {        
        const fileType = event.target.files[0].type.split("/")[0]
        if (fileType == "image") {
            const reader = new FileReader();
            setCollectionFile(event.target.files[0])       
            reader.readAsArrayBuffer(event.target.files[0])
            setCollectionImgUploading(true)
            reader.onload = function(event) {
                const buffer = Buffer.from(reader.result);
                getImageIpfsHash(buffer).then((hash) => {
                    setCollectionImgHash(`https://ipfs.io/ipfs/${hash}`)
                    setCollectionImgUploading(false)
                })
            };
        }        
    }

    function closeMainFile(){
        setMainFile(null)
        setMainFileHash("")
        setMainFileUploading(false)
        setShowCoverUpload(false)

        setCoverImgFile(null)
        setCoverImgHash("")
        setCoverImageUploading(false)
        setMediaType("")
    }
    function closeCoverImg(){        
        setCoverImgFile(null)
        setCoverImgHash("")
        setCoverImageUploading(false)        
    }
	function closeCollectionImg(){        
        setCollectionFile(null)
        setCollectionImgHash("")
        setCollectionImgUploading(false)        
    }


	function onCreateCollection() {
        if (!newCollectionName){
            setSnackBarMessage("Please Input Collection Name!")
            setOpenSnackbar(true)
            return
        } 
        if (!collectionImgHash){
            setSnackBarMessage("Please Select Collection Image!")
            setOpenSnackbar(true)
            return
        }

        setCreatingCollection(false);
        // call createCollection contract function        
        axios.get(`/api/collection/exist?name=${newCollectionName}`)
            .then((res) => {
                setSnackBarMessage("Collection Name is already existed!")
                setOpenSnackbar(true)
                return;
            })
            .catch((error) => {
                if (error.response.status === 404) {
                    setCreatingCollection(true);
                    createNewCollection(
                        newCollectionName,
                        collectionImgHash,
                        false,
                        chainId,
                        library.getSigner()
                    ).then((collectionAddress) => {
                        if (collectionAddress) {                        
                            axios.get(`/api/sync_block`)
                            .then((res) => {
                                setNewCollectionName("");
                                setCollectionImgHash("");
                                setSnackBarMessage("Success!");
                                setOpenSnackbar(true);
                                setShowCreateCollectionDlg(false);
                                fetchCollections();                        
                                setCreatingCollection(false);
                            })
                            .catch((error) => {
                                setNewCollectionName("");
                                setCreatingCollection(false);
                                setSnackBarMessage("Server syncing failed!");
                                setOpenSnackbar(true);                                    
                            });
                        } else {
                            setNewCollectionName("");
                            setCreatingCollection(false);
                            setSnackBarMessage("Transaction failed!");
                            setOpenSnackbar(true);                        
                        }
                    });
                }
            });                
    }

    function onCreateItem() {  
        if (!name){
            setSnackBarMessage("Please Input Title!")
            setOpenSnackbar(true)
            return
        } 
        if (!description){
            setSnackBarMessage("Please Input Description!")
            setOpenSnackbar(true)
            return
        }
        if (royalty > 20 || royalty < 5){
            setSnackBarMessage("Please Input Royalty Correctly!")
            setOpenSnackbar(true)
            return
        }
        if (!category){
            setSnackBarMessage("Please Select Category!")
            setOpenSnackbar(true)
            return
        }
        if (!selectedCollection){
            setSnackBarMessage("Please Select Collection!")
            setOpenSnackbar(true)
            return
        }
        if (!mainFileHash){
            setSnackBarMessage("Please Upload file!")
            setOpenSnackbar(true)
            return
        }
        if ((mediaType === "video" || mediaType === "audio") && !coverImgHash){
            setSnackBarMessage("Please Upload cover image!")
            setOpenSnackbar(true)
            return
        }
        // call createItem contract function
        
        const openseadata = {
            assetType: mediaType,
            category: category,
            name: name,
            description: description,
            mainData: mainFileHash,
            coverImage: coverImgHash
        };
        setCreatingItem(true);    
        getImageIpfsHash(Buffer.from(JSON.stringify(openseadata))).then((hash) => {
            let tokenUri = `https://ipfs.io/ipfs/${hash}`;
            addItem(
                selectedCollection.address,
                tokenUri,
                royalty * 10,
                chainId,
                library.getSigner()
            ).then((tokenId) => {
                if (tokenId) {
                    axios.get(`/api/sync_block`)
                    .then((res) => {
                        setSnackBarMessage("Success");
                        setOpenSnackbar(true);
                        props.history.push(`/profile/${account}`)
                        setCreatingItem(false);
                        return true;
                    })
                    .catch((error) => {
                        if (error.response) {
                            setSnackBarMessage(error.response.data.message);
                            setOpenSnackbar(true);
                            setCreatingItem(false);
                        }
                    });
                } else {
                    setSnackBarMessage("Failed Transaction");
                    setCreatingItem(false);
                    setOpenSnackbar(true);
                }
            });
        });
    }

  return (
	<section className="blog-area section-padding-100">
		<div className="container">
			<InfoComponent
              titleSm='Create Item'
              titleLg=''              
            />
			<div className="row">
			
				<div className="col-lg-3 col-sm-6 col-xs-12">
					<div className="pricing-item ">
						<div className="wraper">
							<div className="img-container">
								<div><img src={coverImgHash ? coverImgHash : bgImg} alt="" /></div>
							</div>							
							<div className="owner-info">
								<div className="user-img-container">
									<img src={userProfile?.profilePic} alt="" />
								</div>
								<div><h3>{userProfile?.name}</h3></div>
							</div>
                            <div><h4>{name}</h4></div>
							
							<div className="admire">
								<span className="g-text">Not for sale</span>
							</div>
						</div>
					</div>
				</div>

				<div className="col-12 col-lg-8">
					<div className="creator-sec dd-bg"> 
						<div className="contact_form">
							<form action="#" method="post" id="main_contact_form" novalidate>
								<div className="row">
									<div className="col-12">
										<div id="success_fail_info"></div>
									</div>

									<div className="col-12 col-md-12 mb-30">
										<p className="w-text mb-0">Upload file</p>										
										<div className="UploadContainer" style = {{display : mainFile? "none":""}}>
											<div className="UploadCaption">PNG, GIF, WEBP, MP4 or MP3. Max 100mb</div>
											<div className="ChooseFileBtn">
												Choose File
												<input className="FileInput" type="file" value="" accept="image/*,audio/*,video/*" onChange={handleMainFile}/>
											</div>
										</div>
										<div className="PreviewContainer" style = {{display : mainFile? "":"none"}}>                     
											<div className="CloseIconContainer" style = {{display : mainFileHash ? "":"none"}}>                          
												<CloseIcon style={{color:'lightgrey'}} onClick={() => closeMainFile()} fontSize="small" />
											</div>
											<div className="MediaContainer">  
												<CircularProgress style={{display : mainFileUploading ? "":"none", width: "30px", height: "30px", color: "red"}}/>                        
												<img className="ImagePreview" style = {{display : mainFileHash && mediaType === "image" ? "":"none"}} src={mainFileHash} alt="main"/>
												<audio className="AudioPreview" style = {{display : mainFileHash && mediaType === "audio" ? "":"none"}} src={mainFileHash} autoPlay loop controls/>  
												<video className="VideoPreview" style = {{display : mainFileHash && mediaType === "video" ? "":"none"}} src={mainFileHash} autoPlay loop controls/>
											</div>                    
										</div>               
									</div>
									<div className="col-12 col-md-12 mb-30" style = {{display : showCoverUpload ? "":"none"}}>
										<p className="w-text mb-0">Upload cover</p>
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
												<CircularProgress style={{display : coverImageUploading ? "":"none", width: "30px", height: "30px", color: "red"}}/>                        
												<img className="ImagePreview" style = {{display : coverImgHash ? "":"none"}} src={coverImgHash} alt="cover"/>                        
											</div>                    
										</div>
										<p className="mb-0">Please add cover Image to your media file</p>										
									</div> 

                                    <S.CollectionContainer>
                                        <S.SelectCollection>
                                            <S.label>Choose collection</S.label>
                                            <S.Collections>
                                                <S.collection onClick={() => setShowCreateCollectionDlg(true)}>
                                                    <S.CollectionPlusIcon size={48}/>
                                                    <S.CollectionName>Create</S.CollectionName>
                                                    <S.CollectionType>ERC-721</S.CollectionType>
                                                </S.collection>
                                                {
                                                    collections.map((collection, index)=> {                             
                                                        return (
                                                            <S.collection key={index} onClick={() => setSelectedCollection(collection)} className={selectedCollection === collection? 'active':''}>
                                                                <S.CollectionIcon src={collection.uri}/>
                                                                <S.CollectionName>{collection.name}</S.CollectionName>                        
                                                            </S.collection>
                                                        );
                                                    })
                                                }                    
                                            </S.Collections>
                                        </S.SelectCollection>
                                    </S.CollectionContainer>

									
									
									<div className="col-12 col-md-12 mb-30">
										<div className="mb-15">
											<p className="w-text">Choose item Category</p>
											<div className="filers-list ">
											{
												categories.map((categoryItem, index)=> {                             
													return (
														<div key={index} className={`filter-item mr-15 ${categoryItem.name === category ? 'active' : ''}`}  onClick={() => setCategory(categoryItem.name)}>
															{categoryItem.name}
														</div>														
													);
												})
											} 	
											</div>
										</div>
									</div>

									<div className="col-12 col-md-12">
										<div className="group">
											<p className="w-text mb-0">Item name</p>
											<input type="text" value={name} name="name" id="name"
												onChange={event => setName(event.target.value)} />											
										</div>
									</div>
									
									<div className="col-12 col-md-12">
										<div className="group">
											<p className="w-text mb-0">Item Description</p>
											<input type="text" value={description} name="name" id="name"
												onChange={event => setDescription(event.target.value)} />											
										</div>
									</div>
									
									<div className="col-12 col-md-12">
										<div className="group">
											<p className="w-text mb-0">Royalties (5% ~ 10%)</p>
											<input type="number" value={royalty} name="name" id="name"
												onChange={event => setRoyalty(event.target.value)} />											
										</div>
									</div>								
										
									<div className="col-12 text-center">
										<div className="more-btn mb-15" disabled={creatingItem} onClick={() => onCreateItem()}>
										{
											creatingItem ? <CircularProgress style={{width: "16px", height: "16px", color: "white",}}/>:"Create item"
										}											
										</div>
									</div>
								</div>
							</form>
						</div>
					</div>					
				</div>
			
			</div>
		</div>
		<Modal
			isOpen={showCreateCollectionDlg}
			onRequestClose={() => setShowCreateCollectionDlg(false)}
			ariaHideApp={false}
			style={{
				overlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(60, 67, 53, 0.5)', zIndex: 99, },
				content: { top: '50%', left: '50%', right: 'auto', bottom: 'auto', marginRight: '-50%', transform: 'translate(-50%, -50%)', width: '100%', maxWidth: '500px', borderRadius: '20px', zIndex: 9999},
            }}
		>
			<S.ModalBody>
				<S.ModalTitle>Collection</S.ModalTitle>                    
				<S.ModalContent>                        
					<S.UploadContainer style = {{display : collectionFile? "none":""}}>
						<S.UploadCaption>We recommend an image of at least 400X400.</S.UploadCaption>
						<S.ChooseFileBtn>
							Choose File
							<S.FileInput type="file" value="" accept="image/*" onChange={handleCollectionImg}/>
						</S.ChooseFileBtn>                    
					</S.UploadContainer>

					<S.PreviewContainer style = {{display : collectionFile? "":"none"}}>                     
						<S.CloseIconContainer style = {{display : collectionImgHash ? "":"none"}}>                          
							<CloseIcon onClick={() => closeCollectionImg()} fontSize="small" />
						</S.CloseIconContainer>
						<S.MediaContainer>  
							<CircularProgress style={{display : collectionImgUploading ? "":"none", width: "30px", height: "30px", color: "red"}}/>                        
							<S.ImagePreview style = {{display : collectionImgHash ? "":"none"}} src={collectionImgHash}/>                        
						</S.MediaContainer>                    
					</S.PreviewContainer> 
				</S.ModalContent>

				<S.Field>
					<S.label>Display name</S.label>
					<S.Input placeholder={"Enter name"} value={newCollectionName} onChange={event => setNewCollectionName(event.target.value)}/>
				</S.Field>
				<S.ModalAction>
					<S.ModalButton disabled={creatingCollection} onClick={() => onCreateCollection()}>
						{
							creatingCollection ? <CircularProgress style={{width: "16px", height: "16px", color: "white",}}/>:"Create collection"
						}                            
					</S.ModalButton>
				</S.ModalAction>
			</S.ModalBody>
		</Modal>
		<Snackbar
			anchorOrigin={{
				vertical: 'bottom',
				horizontal: 'left',
			}}
			open={openSnackbar}
			autoHideDuration={3000}
			onClose={handleCloseDialog}
			message={snackBarMessage}
			action={
				<React.Fragment>
				<IconButton size="small" aria-label="close" color="inherit" onClick={handleCloseDialog}>
					<CloseIcon fontSize="small" />
				</IconButton>
				</React.Fragment>
			}
			/>    
	</section>
  );
}

export default CreateItemContainer;