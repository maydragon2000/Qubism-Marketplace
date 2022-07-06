import React , {useState,useEffect} from "react";
import {useParams} from "react-router-dom";
import { useWeb3React } from '@web3-react/core'
import axios from 'axios'


import { NavLink } from "react-router-dom";
import {SortingCard} from '../../utils'

import PartProfile from "../../components/PartProfile"
import NFTItem from '../../components/NFTItem'

import '../../assets/css/profile.css'

const qs = require('query-string');

const ProfileContainer = (props) => {
	let { address } = useParams();
	const parsed = qs.parse(props.location.search); // parsed.search
	const { user, login } = props;
	const [userProfile, setUserProfile] = useState(undefined)
	const { account, library } = useWeb3React();

	const [curTab, setCurTab] = useState('all')
	const [items, setItems] = useState([]) 
	const [page, setPage] = useState(1)
    const [noItems, setNoItems] = useState(false)
    const [initialItemsLoaded, setInitialItemsLoaded] = useState(false)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
      SortingCard()
    },[])

	useEffect(() => {        
		if (!userProfile){
		  getUser()
		}        
	}, [user])	
	useEffect(() => {
		if(!!user) {
		  login();
		}
	}, [user, account, library])
	function getUser(){
		axios.get(`/api/user/${address ? address : ""}`)
		.then(res => {
		  setUserProfile(res.data.user)                
		})
	}

	useEffect(() => {    
        setItems([])
        setNoItems(false)
        setInitialItemsLoaded(false)
        setLoading(true)   
        setPage(1)    		
        fetchItems(true)    
    }, [curTab,address,parsed.search])
    
    useEffect(() => {
        setLoading(true)    
        if (initialItemsLoaded){			
            fetchItems(false);
        }
    }, [page])
    
    function fetchItems(reset){ 
		if (address) {
			let query = `/api/item/?itemOwner=${address}`;           
            switch (curTab) {
                case 'all':
                    // get all 
                    query = `/api/item/?itemOwner=${address}`; 
                    break;
				case 'sale':
					// On Sale
					query = `/api/item/?itemOwner=${address}&saleType=all`; 
					break;
				case 'owned':
                    // Owned
                    query = `/api/item/?owner=${address}`; 
                    break;
                case 'created':
                    // Created
                    query = `/api/item/?creator=${address}`; 
                    break;
				default:
                    break;
            }
			if (parsed.search){
				query = `${query}&searchTxt=${parsed.search}`
			}       
			let queryUrl = `${query}&page=${reset ? 1 : page}`				
			axios.get(queryUrl)
			.then(res => {
				setLoading(false)   
				if (res.data.items.length === 0) setNoItems(true)      
				if (reset){        
					setItems(res.data.items)
					setInitialItemsLoaded(true)
				}else{
					let prevArray = JSON.parse(JSON.stringify(items))
					prevArray.push(...res.data.items)
					setItems(prevArray)        
				}            
			})
			.catch(err => {            
				setLoading(false)  
				if (err.response.data.message === 'No Items found') {
					setNoItems(true)    
				}      
			})
		}
    }
    
    function loadMore() {
        if (!loading) {
            setPage(page => {return (page + 1)}) 
        }      
    }

  return (
	<section className="blog-area section-padding-100">
		<div className="container">
			<div className="row">
				<div className="col-12 col-lg-3 mt-100 mb-30">
					<PartProfile
						name={userProfile?.name}
						role={userProfile?.role}
						bio={userProfile?.bio}
						profilePic={userProfile?.profilePic}
						coverImg={userProfile?.coverImg}		
						id={userProfile?.address}				      
					/> 
					<div className="col-12 col-lg-12 text-center mt-20">
						<NavLink className="btn more-btn" to="/editprofile">Edit Profile</NavLink>
					</div>
				</div>	
						
				
				<div className="col-12 col-md-9">	
					<div className="dream-projects-menu mb-15">
						<div className="text-center portfolio-menu">
							<button className={`btn ${curTab==='all' ? 'active' : ''}`}
								onClick={() => setCurTab('all')}>
									All								
							</button>
							<button className={`btn ${curTab==='owned' ? 'active' : ''}`}
								onClick={() => setCurTab('owned')}>
									Collectable
							</button>
							<button className={`btn ${curTab==='created' ? 'active' : ''}`}
								onClick={() => setCurTab('created')}>
									Created
							</button>
							<button className={`btn ${curTab==='sale' ? 'active' : ''}`}
								onClick={() => setCurTab('sale')}>
									On Sale
							</button>
						</div>
					</div>
					<div className="search-widget-area mb-50">
						<form>
							<input type="search" name="search" id="search" defaultValue={parsed.search} placeholder="Search Items..." />
							<button type="submit" className="btn"><i className="fa fa-search"></i></button>
						</form>
					</div>				
					<div className="row align-items-center">					
						{items.map((item , index) => (
							<div className="col-12 col-md-6 col-lg-4">
								<NFTItem key={index} {...props} item={item} />                  
							</div>									
						))}
						<div className="col-12 col-lg-12 text-center" style={{display: noItems ? "none" : ""}}>
							<div className="btn more-btn" onClick={() => loadMore()}>
								{loading ? "Loading..." : "Load more"}
							</div>
						</div>					
						
					</div>
				</div>
			</div>
		</div>
	</section>

  );
}

export default ProfileContainer;