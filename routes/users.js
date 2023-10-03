var express = require('express');
var router = express.Router();

// Variáveis para testar o recurso foreach
var mascots = [
  { name: 'Sammy', organization: "DigitalOcean", birth_year: 2012 },
  { name: 'Tux', organization: "Linux", birth_year: 1996 },
  { name: 'Moby Dock', organization: "Docker", birth_year: 2013 }
];
var tagline = "No programming concept is complete without a cute animal mascot.";
/* GET users listing. */
router.get('/', function (req, res, next) {
  res.render('user', {
    title: 'Pet Top Store',
    employee: res.locals.employee,
    mascots: mascots,
    tagline: tagline
  });
});

module.exports = router;
