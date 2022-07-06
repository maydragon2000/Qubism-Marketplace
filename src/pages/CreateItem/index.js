import * as React from 'react';
import Head from '../../layouts/Head';
import CreateItemContainer from '../../containers/CreateItem';
import Footer from '../../layouts/Footer';

const CreateItem = (props) => {

  return (
    <>
      <Head {...props} Title='Create Item' />
      <CreateItemContainer {...props}/>
      <Footer />
    </>
  );
}

export default CreateItem;

