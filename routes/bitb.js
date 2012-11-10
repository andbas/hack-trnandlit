
/*
 * GET home page.
 */

exports.index = function(req, res){
  var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  if(req.query.email!=null && re.test(req.query.email)){
    res.render('bitb', { title: 'Bit Brothers!', userid: req.query.email});
  }else {
    res.redirect('/');
  }
};