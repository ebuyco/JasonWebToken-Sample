import React, { useState, useContext, useEffect } from 'react';
import { navigate } from '@reach/router';
/* eslint-disable */
import { UserContext } from '../pages/App';

const Login = () => {
  const [user, setUser] = useContext(UserContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async e => {
    e.preventDefault();
    const result = await (
      await fetch('http://localhost:3000/login', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      })
    ).json();
    if (result.accesstoken) {
      setUser({
        accesstoken: result.accesstoken,
      });
      navigate('/');
    } else {
      console.log(result.error);
    }
  };

  useEffect(() => {
    console.log(user);
  }, [user]);
  const handleChange = e => {
    if (e.currentTarget.name === 'email') {
      setEmail(e.currentTarget.value);
    } else {
      setPassword(e.currentTarget.value);
    }
  };
  return (
    <>
      <div className="login__wrapper">
        <form action="POST" className="login__inner" onSubmit={handleSubmit}>
          <h2>Login</h2>
          <div className="login__input">
            <input
              value={email}
              onChange={handleChange}
              type="text"
              name="email"
              placeholder="Email"
              autoComplete="email"
            />
            <input
              value={password}
              onChange={handleChange}
              type="password"
              name="password"
              placeholder="Password"
              autoComplete="current-password"
            />
            <button type="submit">Login</button>
          </div>
        </form>
      </div>
    </>
  );
};

export default Login;
