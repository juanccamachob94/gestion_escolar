module.exports = {
  index: (req,res) => {
    res.render('access/index',{userSession: req.session.passport.user});
  }
}
