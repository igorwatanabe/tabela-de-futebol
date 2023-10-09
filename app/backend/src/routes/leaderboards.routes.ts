import { Router } from 'express';
import LeaderboardController from '../controllers/LeaderboardController';

const leaderboardController = new LeaderboardController();

const router = Router();

router.get('/', (req, res) => leaderboardController.getAll(req, res));
router.get('/home', (req, res) => leaderboardController.getAll(req, res));
router.get('/away', (req, res) => leaderboardController.getAll(req, res));

export default router;
