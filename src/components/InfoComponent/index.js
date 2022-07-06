import * as React from 'react';

function InfoComponent({titleSm , titleLg}){
  return(
    <div className="section-heading text-center">
        
        <div className="dream-dots justify-content-center" data-aos="fade-up" data-aos-delay='200'>
            <span>{titleSm}</span>
        </div>
        <h2 data-aos="fade-up" data-aos-delay='300'>{titleLg}</h2>        
    </div>
  )
}

export default InfoComponent