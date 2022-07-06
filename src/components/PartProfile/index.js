import * as React from 'react';
import CreateItemArtworkfire from "../../assets/img/art-work/fire.png"
import { shorter } from "../../utils";

const copyToClipboard = (text) => {
  console.log('text', text)
  var textField = document.createElement('textarea')
  textField.innerText = text
  document.body.appendChild(textField)
  textField.select()
  document.execCommand('copy')
  textField.remove()
}

function PartProfile({name, role, bio, profilePic, coverImg, id}){
	return(
      <div>
         <div className="service_single_content collection-item">            
              <div className="collection_icon">
                <div className="cover-container">
                    <img src={coverImg} alt="" />
                </div> 
              </div>
              <span className="aut-info">
                <div className="author-img-container">
                    <img src={profilePic} alt="" />
                </div>                
              </span>
              <div className="account_info text-center">
                <h6>{name}</h6>
                <p className="w-text mr-5p">{role} <img src={CreateItemArtworkfire} width="20" alt="" /></p>
                <p className="mt-15 scrollable">{bio}</p>

                <div className="search-widget-area mt-15 mb-15">
                    <div className="address-container">
                      <div className="address">{`${shorter(id)}`}</div>                      
                      <button className="btn" onClick={() => copyToClipboard(id)}><i className="fa fa-copy"></i></button>
                    </div>
                </div>               
              </div>
              
          </div>
      </div>
	)
}

export default PartProfile