import * as React from 'react';
import Head from '../../layouts/Head';
import ExploreContainer from '../../containers/Explore';
import Footer from '../../layouts/Footer';

const Explore = (props) => {

  return (
    <>
      <Head {...props} Title='Explore' />
      <ExploreContainer {...props}/>
      <Footer />
    </>
  );
}

export default Explore;