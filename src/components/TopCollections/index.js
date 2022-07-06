import * as React from 'react';
import TopCollectionsItem from '../TopCollectionsItem'
import InfoComponent from '../InfoComponent'


function TopCollectionsContainer(props){
  const {collections} = props;
  return(
    <section className="section-padding-100 clearfix" >
        <div className="container">
            <InfoComponent
              titleSm='Top Collections'
              titleLg='Popular Collections'
            />
            <div className="row">
              {collections.map((collection , index) => (               
                <TopCollectionsItem {...props} collection={collection} />                 
              ))}              
            </div>
        </div>
    </section>
  )
}

export default TopCollectionsContainer