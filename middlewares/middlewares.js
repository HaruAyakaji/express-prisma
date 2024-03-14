import createError from 'http-errors';

export const isAuthenticated = (req, res, next) => {
  return req.session.user ? next() : next(createError(401, '401 Unauthorized'));
};

export const preprocessing = (req, res, next) => {
  const { name, age, birth } = req.body;
  req.body = {};
  if (name) {
    req.body.name = String(name);
  } else {
    return next(createError(409, 'The name is required...'));
  }
  if (/^\d+$/.test(age)) {
    req.body.age = +age;
  }
  if (birth && !Number.isNaN(+new Date(birth))) {
    req.body.birth = new Date(birth);
  }
  return next();
};
