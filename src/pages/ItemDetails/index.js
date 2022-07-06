import * as React from 'react';
import Head from '../../layouts/Head';
import ItemDetailsContainer from '../../containers/ItemDetails';
import Footer from '../../layouts/Footer';

const ItemDetails = (props) => {

  return (
    <>
      <Head {...props} Title='Item Details' />
      <ItemDetailsContainer {...props} />
      <Footer />
    </>
  );
}

export default ItemDetails;