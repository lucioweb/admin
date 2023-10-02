var express = require('express');
var router = express.Router();
var productsRouter = require('./products');
var salesRouter = require('./sales');

var mascots = [
  { name: 'Sammy', organization: "DigitalOcean", birth_year: 2012 },
  { name: 'Tux', organization: "Linux", birth_year: 1996 },
  { name: 'Moby Dock', organization: "Docker", birth_year: 2013 }
];
var tagline = "No programming concept is complete without a cute animal mascot.";




/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', {
    title: 'Pet Top Store',
    employee: res.locals.employee,
    mascots: mascots,
    tagline: tagline
  });
});

router.use('/products', productsRouter);
router.use('/sales', salesRouter);

module.exports = router;
