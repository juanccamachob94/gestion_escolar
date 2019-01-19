/**
 * Control de acceso con base en la función isAuthenticated de passport
 */
 module.exports = (req,res,next) => {
   if(req.isAuthenticated()) next();
   else {
     res.redirect('/user/logIn');
   }
 }
