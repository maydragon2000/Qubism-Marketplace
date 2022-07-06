import * as React from 'react';
import Head from '../../layouts/Head';
import AuctionsContainer from '../../containers/Auctions';
import Footer from '../../layouts/Footer';
function Auctions(props){

  return(
    <>
      <Head {...props} Title='Auctions' />
      <AuctionsContainer {...props}/>
      <Footer />
    </>
  )
}

export default Auctions