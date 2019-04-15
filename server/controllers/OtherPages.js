const aboutPage = (req, res) => res.render('about', { csrfToken: req.csrfToken() });

const themesPage = (req, res) => res.render('themes', { csrfToken: req.csrfToken() });

module.exports.aboutPage = aboutPage;
module.exports.themesPage = themesPage;
