require('dotenv/config');
const express = require('express');

const cookieParser = require('cookie-parser');
const cors = require('cors');
const { verify } = require('jsonwebtoken');
const { hash, compare } = require('bcryptjs');
const { fakeDB } = require('./fakeDB.js');

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

server.listen(process.env.PORT, () =>
  console.log(`Server is listening on http://localhost:${process.env.PORT}`)
);
