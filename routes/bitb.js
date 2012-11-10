
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('bitb', { title: 'Bit Brothers!', userid: 'trnl.me@gmail.com'});
};