import * as React from 'react';
import Head from '../../layouts/Head';
import ContactContainer from '../../containers/Contact';
import Footer from '../../layouts/Footer';

const Contact = (props) => {


  return (
	<>
		<Head {...props} Title='Contact Us' />
		<ContactContainer {...props}/>
		<Footer/>
	</>
  );
}

export default Contact;

