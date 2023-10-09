import { Request, Response } from 'express';
import LeaderboardService from '../services/LeaderboardService';
import mapStatusHTTP from '../utils/mapStatusHTTP';

export default class LeaderboardController {
  constructor(
    private leaderboardService = new LeaderboardService(),
  ) { }

  public async getAll(req: Request, res: Response): Promise<Response> {
    // const homeOrAway = (req.path).replace('/', '');
    // console.log('controller', homeOrAway);

    const serviceResponse = await this.leaderboardService.getAll();
    return res.status(mapStatusHTTP(serviceResponse.status)).json(serviceResponse.data);
  }
}
