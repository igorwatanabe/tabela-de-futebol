import { ServiceMessage, ServiceResponse } from '../Interfaces/ServiceResponse';
import { IMatchAdapter } from '../Interfaces/matches/IMatch';
import { IMatchModel } from '../Interfaces/matches/IMatchModel';
import MatchModel from '../models/MatchModel';

export default class MatchService {
  constructor(
    private matchModel: IMatchModel = new MatchModel(),
  ) { }

  public async findAll(statusGame:string): Promise<ServiceResponse<IMatchAdapter[]>> {
    const allMatches = await this.matchModel.findAll(statusGame);
    const matchesReturn = allMatches
      .map(({ id, homeTeamId, homeTeamGoals,
        awayTeamId, awayTeamGoals, inProgress, homeTeam, awayTeam,
      }) => ({
        id,
        homeTeamId,
        homeTeamGoals,
        awayTeamId,
        awayTeamGoals,
        inProgress,
        homeTeam,
        awayTeam }));
    return { status: 'SUCCESSFUL', data: matchesReturn };
  }

  public async finishMatch(id:number): Promise<ServiceResponse<ServiceMessage>> {
    await this.matchModel.update(id);

    return { status: 'SUCCESSFUL', data: { message: 'Finished' } };
  }
}
