import React, {useState,useEffect} from "react";
import axios from 'axios'
import HeroContainer from './Hero'
import TopSellers from '../../components/TopSellers'
import TopCollections from '../../components/TopCollections'
import ListedItems from '../../components/ListedItems'
import LiveAuctions from '../../components/LiveAuctions'

import '../../assets/css/home.css'

const HomeContainer = (props) => {

	const [sellers, setSellers] = useState([]);
	const [collections, setCollections] = useState([]);
	const [listedItems, setListedItems] = useState([]);
	const [auctions, setAuctions] = useState([]);

	useEffect(() => {
		fetchSellers();
		fetchCollections();
		fetchListedItems();
		fetchAuctions();
	}, [props])

	function fetchSellers(){
		axios.get(`/api/topSellers`)
		.then(res => {
			setSellers(res.data.users)                 
		})
		.catch(err => {
		  //show an error page that the item doesnt exist
		  setSellers([])      
		})
	}	
	function fetchCollections(){
		axios.get(`/api/topCollections`)
		.then(res => {
			setCollections(res.data.collections)                 
		})
		.catch(err => {
		  //show an error page that the item doesnt exist
		  setCollections([])      
		})
	}
	function fetchListedItems(){
		axios.get(`/api/item/?saleType=fixed`)
		.then(res => {
			setListedItems(res.data.items)                 
		})
		.catch(err => {
		  //show an error page that the item doesnt exist
		  setListedItems([])      
		})
	}
	function fetchAuctions(){
		axios.get(`/api/item/?saleType=auction`)
		.then(res => {
			setAuctions(res.data.items)                 
		})
		.catch(err => {
		  //show an error page that the item doesnt exist
		  setAuctions([])      
		})
	}
	

  return (
  	<>
	 	<HeroContainer {...props}/>
		<TopSellers {...props} sellers={sellers}/>
		<TopCollections {...props} collections={collections}/>
		<ListedItems {...props} listedItems={listedItems}/>
		<LiveAuctions {...props} auctions={auctions}/>

    </>
  );
}

export default HomeContainer;