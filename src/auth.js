function requireAuth(req, res, next) {
  if (req.session?.user) return next();
  if (req.accepts('html')) {
    req.session.returnTo = req.originalUrl;
    return res.redirect('/login');
  }
  return res.status(401).json({ error: 'กรุณาเข้าสู่ระบบ' });
}

module.exports = { requireAuth };
