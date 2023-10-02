import { Router } from 'express';
import TeamsController from '../controllers/TeamController';

const teamController = new TeamsController();

const router = Router();

router.get('/', (req, res) => teamController.getAllTeams(req, res));
router.get('/:id', (req, res) => teamController.getTeamById(req, res));

export default router;
