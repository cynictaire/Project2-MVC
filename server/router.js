const controllers = require('./controllers');
const mid = require('./middleware');

const router = (app) => {
  app.get('/getToken', mid.requiresSecure, controllers.Account.getToken);
  app.get('/getPosts', mid.requiresLogin, controllers.Post.getPosts);
    
  app.get('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
  app.post('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.login);
  app.post('/signup', mid.requiresSecure, mid.requiresLogout, controllers.Account.signup);
  app.get('/logout', mid.requiresLogin, controllers.Account.logout);
  app.post('/changePW', mid.requiresSecure, mid.requiresLogin, controllers.Account.changePW);
    
  app.get('/about', mid.requiresSecure, mid.requiresLogin, controllers.OtherPages.aboutPage);
  app.get('/themes', mid.requiresSecure, mid.requiresLogin, controllers.OtherPages.themesPage);
    
  app.get('/maker', mid.requiresLogin, controllers.Post.makerPage);
  app.post('/maker', mid.requiresLogin, controllers.Post.make);
  app.post('/delete', mid.requiresSecure, mid.requiresLogin, controllers.Post.deletePosts);
  
  app.get('/', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
};

module.exports = router;
