import 'dotenv/config';
import express from 'express';
import session from 'express-session';
import multer from 'multer';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import apiRouter from './routes/api.routes.js';
import authRouter from './routes/auth.routes.js';
import indexRouter from './routes/index.routes.js';
import { isAuthenticated } from './middlewares/middlewares.js';

const app = express();
const upload = multer();

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(upload.any());
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    name: 'userId',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 86400000, secure: 'auto' },
  })
);

app.use('/api', isAuthenticated, apiRouter);
app.use('/auth', authRouter);
app.use('/', indexRouter);
app.use((err, req, res, next) => {
  const { status = 500, message } = err;
  if (err instanceof PrismaClientKnownRequestError && err.code === 'P2002') {
    return res.status(status).json({ message: 'The name has been used already...' });
  }
  return res.status(status).json({ message });
});

app.listen(process.env.PORT, () => {
  console.log(`Server is start at ${process.env.HOSTNAME}`);
});
