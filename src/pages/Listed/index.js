import * as React from 'react';
import Head from '../../layouts/Head';
import ListedContainer from '../../containers/Listed';
import Footer from '../../layouts/Footer';

const Listed = (props) => {

  return (
    <>
      <Head {...props} Title='Listed' />
      <ListedContainer {...props}/>
      <Footer />
    </>
  );
}

export default Listed;