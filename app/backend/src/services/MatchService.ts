import { ServiceMessage, ServiceResponse } from '../Interfaces/ServiceResponse';
import { NewEntity } from '../Interfaces/index';
import { IMatch, IMatchAdapter, IMatchCreate } from '../Interfaces/matches/IMatch';
import { IMatchModel } from '../Interfaces/matches/IMatchModel';
import { ITeamModel } from '../Interfaces/teams/ITeamModel';
import MatchModel from '../models/MatchModel';
import TeamModel from '../models/TeamModel';

export default class MatchService {
  constructor(
    private matchModel: IMatchModel = new MatchModel(),
    private teamModel: ITeamModel = new TeamModel(),
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

  public async updateMatchGoals(id:number, homeTeamGoals: number, awayTeamGoals: number)
    : Promise<ServiceResponse<ServiceMessage>> {
    const matchInProgress = await this.matchModel.findById(id);

    if (!matchInProgress?.inProgress) {
      return { status: 'INVALID_DATA', data: { message: 'No match in progress' } };
    }

    await this.matchModel.updateMatchGoals(id, homeTeamGoals, awayTeamGoals);
    return { status: 'SUCCESSFUL', data: { message: 'Updated Goals' } };
  }

  public async createMatch(data: NewEntity<IMatchCreate>):Promise<ServiceResponse<IMatch>> {
    const { homeTeamId, awayTeamId } = data;
    const teams = [homeTeamId, awayTeamId];

    const findTeams = await Promise.all(teams.map(async (idTeam) => (
      this.teamModel.findById(idTeam))));

    const nullTest = findTeams.find((element) => element === null);

    if (nullTest === null) {
      return { status: 'NOT_FOUND', data: { message: 'There is no team with such id!' } };
    }
    const newMatch = await this.matchModel.createMatch(data);
    return { status: 'CREATED', data: newMatch };
  }
}
