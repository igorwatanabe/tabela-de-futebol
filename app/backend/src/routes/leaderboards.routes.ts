import { Router } from 'express';
import LeaderboardController from '../controllers/LeaderboardController';

const leaderboardController = new LeaderboardController();

const router = Router();

router.get('/home', (req, res) => leaderboardController.getAll(req, res));

// router.post(
//   '/',
//   Validations.validateToken,
//   Validations.validateInputCreateMatch,
//   (req, res) => matchController.createMatch(req, res),
// );

// router.patch(
//   '/:id',
//   Validations.validateToken,
//   (req, res) => matchController.updateMatchGoals(req, res),
// );

// router.patch(
//   '/:id/finish',
//   Validations.validateToken,
//   (req, res) => matchController.finishMatch(req, res),
// );

export default router;
