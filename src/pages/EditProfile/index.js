import * as React from 'react';
import Head from '../../layouts/Head';
import EditProfileContainer from '../../containers/EditProfile';
import Footer from '../../layouts/Footer';

const EditProfile = (props) => {

  return (
    <>
      <Head {...props} Title='Edit Profile' />
      <EditProfileContainer {...props}/>
      <Footer />
    </>
  );
}

export default EditProfile;
