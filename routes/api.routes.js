import express from 'express';
import createError from 'http-errors';
import { PrismaClient } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { preprocessing } from '../middlewares/middlewares.js';

const router = express.Router();
const prisma = new PrismaClient();

router.get('/', async (req, res, next) => {
  try {
    return res.json(await prisma.character.findMany({ orderBy: { createdAt: 'asc' } }));
  } catch (error) {
    return next(createError(409, error));
  }
});

router.get('/:id', async (req, res, next) => {
  const { id } = req.params;
  try {
    return res.json(await prisma.character.findUnique({ where: { id } }));
  } catch (error) {
    return next(createError(409, error));
  }
});

router.post('/', preprocessing, async (req, res, next) => {
  try {
    return res.status(201).json(
      await prisma.character.create({
        data: { ...req.body, googleUserId: req.session.user.id },
      })
    );
  } catch (error) {
    return next(createError(409, error));
  }
});

router.patch('/:id', preprocessing, async (req, res, next) => {
  const { id } = req.params;
  try {
    return res.json(
      await prisma.character.update({
        where: { id },
        data: req.body,
      })
    );
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError && error.code === 'P2025') {
      return res.json(null);
    }
    return next(createError(409, error));
  }
});

router.delete('/:id', async (req, res, next) => {
  const { id } = req.params;
  try {
    await prisma.character.delete({ where: { id } });
    return res.status(204).json();
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError && error.code === 'P2025') {
      return res.status(204).json();
    }
    return next(createError(409, error));
  }
});

export default router;
