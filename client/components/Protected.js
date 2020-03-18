import React, { useEffect, useState, useContext } from 'react';
/* eslint-disable */
import { UserContext } from '../pages/App';

const Protected = () => {
  const [user] = useContext(UserContext);
  const [content, setContent] = useState('You Need to Login');

  useEffect(() => {
    async function fetchProtected() {
      const result = await (
        await fetch('http://localhost:3000/protected', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            authorization: `Bearer ${user.accesstoken}`,
          },
        })
      ).json();
      if (result.data) setContent(result.data);
    }
    fetchProtected();
  }, [user]);
  return (
    <>
      <div>{content}</div>
    </>
  );
};

export default Protected;
