// import { ILeaderboard } from '../Interfaces/leaderboards/ILeaderboard';
// import { ILeaderboardModel } from '../Interfaces/leaderboards/ILeaderboardModel';
// import SequelizeLeaderboard from '../database/models/SequelizeLeaderboard';
// import SequelizeTeam from '../database/models/SequelizeTeam';

// export default class LeaderboardModel implements ILeaderboardModel {
//   private model = SequelizeLeaderboard;

//   async findAll(statusGame: string): Promise<ILeaderboard[]> {
//     const dbData = await this.model.findAll({
//       where: { inProgress: false },
//       include: [{ model: SequelizeTeam,
//         as: 'homeTeam',
//         attributes: ['teamName'],
//       },
//       { model: SequelizeTeam,
//         as: 'awayTeam',
//         attributes: ['teamName'],
//       }],
//       attributes: ['id',
//         'homeTeamId', 'homeTeamGoals', 'awayTeamId', 'awayTeamGoals', 'inProgress'],
//     });
//     return dbData
//       .map(({ name,
//         totalPoints,
//         totalGames,
//         totalVictories,
//         totalDraws,
//         totalLosses,
//         goalsFavor,
//         goalsOwn }) => (
//         { name,
//           totalPoints,
//           totalGames,
//           totalVictories,
//           totalDraws,
//           totalLosses,
//           goalsFavor,
//           goalsOwn }
//       ));
//   }
// }
