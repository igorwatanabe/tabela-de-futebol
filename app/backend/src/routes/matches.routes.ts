import { Router } from 'express';
import MatchesController from '../controllers/MatchController';

const matchController = new MatchesController();

const router = Router();

router.get('/', (req, res) => matchController.getAllMatches(req, res));

export default router;
