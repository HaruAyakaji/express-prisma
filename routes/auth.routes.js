import express from 'express';
import createError from 'http-errors';
import { OAuth2Client } from 'google-auth-library';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const client = new OAuth2Client({
  clientId: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  redirectUri: process.env.GOOGLE_REDIRECT_URI,
});
const prisma = new PrismaClient();

router.post('/login', (req, res) => {
  const authorizeUrl = client.generateAuthUrl({
    access_type: 'offline',
    scope: [
      'https://www.googleapis.com/auth/userinfo.profile',
      'https://www.googleapis.com/auth/userinfo.email',
    ],
    prompt: 'consent',
  });
  return res.redirect(authorizeUrl);
});

router.get('/redirect', async (req, res, next) => {
  try {
    const { tokens } = await client.getToken(req.query.code);
    client.setCredentials(tokens);

    const { data } = await client.request({
      url: 'https://www.googleapis.com/oauth2/v3/userinfo',
    });

    req.session.regenerate(async (err) => {
      if (err) {
        return next(createError(500, err));
      }
      req.session.user = await prisma.googleUser.upsert({
        where: { email: data.email },
        update: data,
        create: data,
      });
      req.session.save((err) => {
        return err ? next(createError(500, err)) : res.redirect('/');
      });
    });
  } catch (error) {
    return next(createError(401, '401 Unauthorized'));
  }
});

router.post('/logout', (req, res, next) => {
  req.session.user = null;
  req.session.save((err) => {
    if (err) {
      return next(createError(500, err));
    }
    req.session.regenerate((err) => {
      return err ? next(createError(500, err)) : res.redirect('/');
    });
  });
});

export default router;
