const jwt = require('jwt-simple');
const dotenv = require('dotenv');

dotenv.config();

module.exports = (req, res, next) => {
  const token = req.headers['authorization'] && req.headers['authorization'].split(' ')[1];
  if (!token) {
    return res.status(403).json({ msg: 'Acesso negado' });
  }

  try {
    const decoded = jwt.decode(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (err) {
    return res.status(403).json({ msg: 'Token inválido' });
  }
};
