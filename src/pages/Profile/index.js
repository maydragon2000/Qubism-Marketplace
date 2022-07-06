import * as React from 'react';
import Head from '../../layouts/Head';
import ProfileContainer from '../../containers/Profile';
import Footer from '../../layouts/Footer';

const Profile = (props) => {

  return (
    <>
      <Head {...props} Title='User Profile' />
      <ProfileContainer {...props}/>
      <Footer />
    </>
  );
}

export default Profile;