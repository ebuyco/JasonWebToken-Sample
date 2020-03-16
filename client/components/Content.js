import React, { useContext } from 'react';
import { Redirect } from '@reach/router';
/* eslint-disable */
import { UserContext } from '../pages/App';

const Content = () => {
  const [user] = useContext(UserContext);
  if (!user.accesstoken) return <Redirect from="" to="login" noThrow />;
  return (
    <>
      <h2>This is the Content</h2>
    </>
  );
};

export default Content;
