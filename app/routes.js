const paginate = require('express-paginate');

const { healthCheck } = require('./controllers/healthCheck');
const { createUser, indexUser } = require('./controllers/usersController');
const { createSession, deleteSession } = require('./controllers/sessionsController');
const { createAdminUser } = require('./controllers/adminController');
const { createWeet, indexWeet } = require('./controllers/weetsController');
const { createRating } = require('./controllers/ratingsController');

const { checkMailIsAlreadyInUse } = require('./middlewares/user');
const { validateSchema } = require('./middlewares/schema_validator');
const { validatePassword, authenticateEndpoint } = require('./middlewares/session');
const { validateAdminUser } = require('./middlewares/admin');

const { userSchema } = require('./schemas/user');
const { sessionSchema } = require('./schemas/session');
const { pageSchema } = require('./schemas/page');
const { ratingSchema } = require('./schemas/rating');

exports.init = app => {
  app.get('/health', healthCheck);

  app.post('/users', [validateSchema(userSchema), checkMailIsAlreadyInUse], createUser);
  app.get('/users', [authenticateEndpoint, paginate.middleware(3, 5)], indexUser);
  app.post('/users/sessions', [validateSchema(sessionSchema), validatePassword], createSession);
  app.post('/users/sessions/invalidate_all', [authenticateEndpoint], deleteSession);

  app.post('/weets', [authenticateEndpoint], createWeet);
  app.get('/weets', [authenticateEndpoint, validateSchema(pageSchema)], indexWeet);

  app.post('/weets/:id/ratings', [authenticateEndpoint, validateSchema(ratingSchema)], createRating);

  app.post(
    '/admin/users',
    [authenticateEndpoint, validateAdminUser, validateSchema(userSchema)],
    createAdminUser
  );
};
