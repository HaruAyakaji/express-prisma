import express from 'express';
import createError from 'http-errors';

const router = express.Router();

router.get('/', (req, res) => {
  return res.render('index', {
    user: req.session.user,
    title: 'MariaDB',
    dbName: 'exampledb',
  });
});

router.route('*').all((req, res, next) => {
  if (req.method === 'GET') {
    return next(createError(404, '404 Not Found'));
  }
  return next(createError(400, '400 Bad Request'));
});

export default router;
