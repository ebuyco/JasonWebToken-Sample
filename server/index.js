require('dotenv/config');
const express = require('express');

const cookieParser = require('cookie-parser');
const cors = require('cors');
const { verify } = require('jsonwebtoken');
const { hash, compare } = require('bcryptjs');
const {
  createAccessToken,
  createRefreshToken,
  sendAccessToken,
  sendRefreshToken,
} = require('./tokens.js');
const { fakeDB } = require('./fakeDB.js');
const { isAuth } = require('./isAuth.js');

const server = express();

server.use(cookieParser());

server.use(
  cors({
    origin: 'http://localhost:8082',
    credentials: true,
  })
);

server.use(express.json());
server.use(express.urlencoded({ extended: true }));

server.post('/register', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = fakeDB.find(user => user.email === email);
    if (user) throw new Error('User already exist');
    const hashedPassword = await hash(password, 10);
    fakeDB.push({
      id: fakeDB.length,
      email,
      password: hashedPassword,
    });
    res.send({ message: 'User Created' });
    console.log(fakeDB);
  } catch (err) {
    res.send({
      error: `${err.message}`,
    });
  }
});

// Login user
server.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = fakeDB.find(user => user.email === email);
    if (!user) throw new Error('User does not Exist');

    const valid = await compare(password, user.password);
    if (!valid) throw new Error('Password not correct');
    const accessToken = createAccessToken(user.id);
    const refreshToken = createRefreshToken(user.id);

    user.refreshToken = refreshToken;
    console.log(fakeDB);
    sendRefreshToken(res, refreshToken);
    sendAccessToken(res, req, accessToken);
  } catch (err) {
    res.send({
      error: `${err.message}`,
    });
  }
});

// Logout User
server.post('/logout', (_req, res) => {
  res.clearCookie('refreshtoken', { path: '/refresh_token' });
  return res.send({
    message: 'Logged out ',
  });
});

// Protected route
server.post('/protected', async (req, res) => {
  try {
    const userId = isAuth(req);
    if (!userId !== null) {
      res.send({
        data: 'This is protected Data',
      });
    }
  } catch (err) {
    res.send({
      error: `${err.message}`,
    });
  }
});

// A new access token with refresh token
server.post('/refresh_token', (req, res) => {
  const token = req.cookies.refreshtoken;

  if (!token) return res.send({ accesstoken: '' });
  let payload = null;

  try {
    payload = verify(token, process.env.REFRESH_TOKEN_SECRET);
  } catch (err) {
    return res.send({
      accesstoken: '',
    });
  }

  const user = fakeDB.find(user => user.id === payload.userId);
  if (!user) return res.send({ accesstoken: '' });
  if (user.refreshtoken !== token) {
    return res.send({ accesstoken: '' });
  }

  const accesstoken = createAccessToken(user.id);
  const refreshtoken = createRefreshToken(user.id);
  user.refreshtoken = refreshtoken;

  sendRefreshToken(res, refreshtoken);
  return res.send({ accesstoken });
});

server.listen(process.env.PORT, () =>
  console.log(`Server is listening on http://localhost:${process.env.PORT}`)
);
