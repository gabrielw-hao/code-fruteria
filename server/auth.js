const express = require('express');
const router = express.Router();

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Dummy user for demonstration
const USER = {
  id: '1',
  username: 'admin',
  email: 'admin@gmail.com',
  passwordHash: bcrypt.hashSync('password', 10),
  role: 'admin',
};

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret';

router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  if (username !== USER.username) {
    return res
      .status(401)
      .json({ success: false, message: 'Invalid credentials' });
  }
  const match = await bcrypt.compare(password, USER.passwordHash);
  if (!match) {
    return res
      .status(401)
      .json({ success: false, message: 'Invalid credentials' });
  }

  const token = jwt.sign(
    { id: USER.id, username: USER.username, role: USER.role },
    JWT_SECRET,
    { expiresIn: '2h' }
  );
  res.json({
    success: true,
    token,
    user: {
      id: USER.id,
      username: USER.username,
      email: USER.email,
      role: USER.role,
    },
  });
});

module.exports = router;
