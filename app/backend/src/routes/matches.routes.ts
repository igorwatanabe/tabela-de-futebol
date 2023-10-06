import { Router } from 'express';
import MatchesController from '../controllers/MatchController';
import Validations from '../middlewares/Validations';

const matchController = new MatchesController();

const router = Router();

router.get('/', (req, res) => matchController.getAllMatches(req, res));

router.patch(
  '/:id',
  Validations.validateToken,
  (req, res) => matchController.updateMatchGoals(req, res),
);

router.patch(
  '/:id/finish',
  Validations.validateToken,
  (req, res) => matchController.finishMatch(req, res),
);

export default router;
