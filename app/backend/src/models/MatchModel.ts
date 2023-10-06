import { IMatchAdapter } from '../Interfaces/matches/IMatch';
import { IMatchModel } from '../Interfaces/matches/IMatchModel';
import SequelizeMatch from '../database/models/SequelizeMatch';
import SequelizeTeam from '../database/models/SequelizeTeam';

export default class MatchModel implements IMatchModel {
  private model = SequelizeMatch;

  async findAll(statusGame: string): Promise<IMatchAdapter[]> {
    const dbData = await this.model.findAll({
      where: statusGame ? { inProgress: statusGame === 'true' || 'false' } : {},
      include: [{ model: SequelizeTeam,
        as: 'homeTeam',
        attributes: ['teamName'],
      },
      { model: SequelizeTeam,
        as: 'awayTeam',
        attributes: ['teamName'],
      }],
      attributes: ['id',
        'homeTeamId', 'homeTeamGoals', 'awayTeamId', 'awayTeamGoals', 'inProgress'],
    });
    return dbData
      .map(({ id, homeTeamId,
        homeTeamGoals, awayTeamId, awayTeamGoals, inProgress, homeTeam, awayTeam }) => (
        { id, homeTeamId, homeTeamGoals, awayTeamId, awayTeamGoals, inProgress, homeTeam, awayTeam }
      ));
  }
}
