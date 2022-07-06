import React , {useState,useEffect} from "react";
import { useWeb3React } from '@web3-react/core'
import axios from 'axios'

import ItemTimeline from './ItemTimeline'
import InfoComponent from '../../components/InfoComponent'
import { ActivityIconsf1, ActivityIconsf3, ActivityIconsf4, ActivityIconsf6, ActivityIconsf7 } from '../../utils/allImgs'

import '../../assets/css/activity.css'

const ActivityContainer = (props) => {
  const { account, library } = useWeb3React();

  const [filter, setFilter] = useState('')
	const [events, setEvents] = useState([]) 
	const [page, setPage] = useState(1)
  const [noEvents, setNoEvents] = useState(false)
  const [initialEventsLoaded, setInitialEventsLoaded] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {    
    setEvents([])
    setNoEvents(false)
    setInitialEventsLoaded(false)
    setLoading(true)   
    setPage(1)    		
    fetchEvents(true)    
  }, [filter,account])

  useEffect(() => {
    setLoading(true)    
    if (initialEventsLoaded){			
        fetchEvents(false);
    }
  }, [page])

  function fetchEvents(reset){ 
    if (account) {
      let query = `/api/activities/?address=${account}`;      
      let queryUrl = `${query}&page=${reset ? 1 : page}${filter ? '&filter=' + filter : ''}`      
      				
      axios.get(queryUrl)
      .then(res => {
        setLoading(false)   
        if (res.data.events.length === 0) setNoEvents(true)      
        if (reset){        
          setEvents(res.data.events)
          setInitialEventsLoaded(true)
        }else{
          let prevArray = JSON.parse(JSON.stringify(events))
          prevArray.push(...res.data.events)
          setEvents(prevArray)        
        }            
      })
      .catch(err => {            
        setLoading(false)  
        if (err.response.data.message === 'No events found') {
          setNoEvents(true)    
        }      
      })
    }
  }

  function loadMore() {
    if (!loading) {
        setPage(page => {return (page + 1)}) 
    }      
  }

  function setMinted(){
    if (filter === 'Minted') {
        setFilter('')
    } else {
        setFilter('Minted')
    }        
  }
  function setListed(){
    if (filter === 'Listed') {
        setFilter('')
    } else {
        setFilter('Listed')
    }         
  }
  function setDelisted(){
    if (filter === 'Delisted') {
        setFilter('')
    } else {
        setFilter('Delisted')
    }
  }
  function setPurchased(){
    if (filter === 'Sold') {
        setFilter('')
    } else {
        setFilter('Sold')
    }        
  }
  function setBid(){
    if (filter === 'Bid') {
        setFilter('')
    } else {
        setFilter('Bid')
    }        
  }

  return (          
    <section className="blog-area section-padding-100">
        <div className="container">
          <InfoComponent
            titleSm='Recent Activity'
            titleLg='Transaction History'              
          />

          <div className="row"> 
              
            <div className="col-12 col-md-4">
              <div className="sidebar-area mr-30">               
                  
                <div className="donnot-miss-widget mb-50">
                  <div className="widget-title">
                    <h5>Filters</h5>
                  </div>
                  <div className="filers-list">
                    <div className={`filter-item mr-15 ${filter === 'Listed' ? 'active' : ''}`}
                      onClick={() => setListed()}>
                      <img src={ActivityIconsf1} alt="" />Listed
                    </div>
                    <div className={`filter-item mr-15 ${filter === 'Delisted' ? 'active' : ''}`}
                      onClick={() => setDelisted()}>
                      <img src={ActivityIconsf6} alt="" />Delisted
                    </div>
                    <div className={`filter-item mr-15 ${filter === 'Bid' ? 'active' : ''}`}
                      onClick={() => setBid()}>
                      <img src={ActivityIconsf3} alt="" />Bid
                    </div>
                    <div className={`filter-item mr-15 ${filter === 'Sold' ? 'active' : ''}`}
                      onClick={() => setPurchased()}>
                      <img src={ActivityIconsf4} alt="" />Purchased
                    </div>
                    <div className={`filter-item mr-15 ${filter === 'Minted' ? 'active' : ''}`} 
                      onClick={() => setMinted()}>
                      <img src={ActivityIconsf7} alt="" />Minted
                    </div>                    
                  </div>
                </div>         
              </div>
            </div>

            <div className="col-12 col-md-8">
              <div className="timelineBox">
                
                <div className="timelineBody">
                  <ul className="timeline">
                    {events && events.map((event , index) => (
                      <ItemTimeline key={index} {...props} event={event} /> 
                    ))}                    
                  </ul>
                </div>

                <div className="col-12 col-lg-12 mt-30 mb-30 text-center" style={{display: noEvents ? "none" : ""}}>
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

export default ActivityContainer;