import * as React from 'react';
import Head from '../../layouts/Head';
import ActivityContainer from '../../containers/Activity';
import Footer from '../../layouts/Footer';

const Activity = (props) => {

  return (
    <>
      <Head {...props} Title='Activity' />
      <ActivityContainer {...props} />
      <Footer />
    </>
  );
}

export default Activity;