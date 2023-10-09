import { ServiceResponse } from '../Interfaces/ServiceResponse';
import { ILeaderboard } from '../Interfaces/leaderboards/ILeaderboard';
import { IMatchAdapter } from '../Interfaces/matches/IMatch';
import { IMatchModel } from '../Interfaces/matches/IMatchModel';
import MatchModel from '../models/MatchModel';

export default class MatchService {
  constructor(
    // private leaderboardModel: ILeaderboardModel = new LeaderboardModel(),
    private matchModel: IMatchModel = new MatchModel(),
  ) { }

  // private vitoria(array) {
  //   array
  //     .filter(({ homeTeamGoals, awayTeamGoals }) => (homeTeamGoals > awayTeamGoals))
  //     .map((match) => {
  //       const existingTeam = array.find(({ name }) => name === match.homeTeam?.teamName);

  //       if (existingTeam) {
  //         // Se o time já existe no leaderboard, atualize os pontos.
  //         existingTeam.totalPoints += 3;
  //         existingTeam.totalGames += 1;
  //         existingTeam.totalVictories += 1;
  //         existingTeam.goalsFavor += match.homeTeamGoals;
  //         existingTeam.goalsOwn += match.awayTeamGoals;
  //       } else {
  //         // Caso contrário, crie um novo item no leaderboard.
  //         const newItem = {
  //           name: match.homeTeam?.teamName,
  //           totalPoints: 3,
  //           totalGames: 1,
  //           totalVictories: 1,
  //           totalDraws: 0,
  //           totalLosses: 0,
  //           goalsFavor: match.homeTeamGoals,
  //           goalsOwn: match.awayTeamGoals,
  //         };
  //         array.push(newItem);
  //       }
  //     });
  //   return array;
  // }

  // public async getAll(): Promise<ServiceResponse<ILeaderboard[]>> {
  //   const statusGame = 'false';
  //   const allMatches = await this.matchModel.findAll(statusGame);

  //   const leaderboard: any[] = [];

  //   // vitoria
  //   allMatches
  //     .filter(({ homeTeamGoals, awayTeamGoals }) => (homeTeamGoals > awayTeamGoals))
  //     .map((match) => {
  //       const existingTeam = leaderboard.find(({ name }) => name === match.homeTeam?.teamName);

  //       if (existingTeam) {
  //         // Se o time já existe no leaderboard, atualize os pontos.
  //         existingTeam.totalPoints += 3;
  //         existingTeam.totalGames += 1;
  //         existingTeam.totalVictories += 1;
  //         existingTeam.goalsFavor += match.homeTeamGoals;
  //         existingTeam.goalsOwn += match.awayTeamGoals;
  //       } else {
  //         // Caso contrário, crie um novo item no leaderboard.
  //         const newItem = {
  //           name: match.homeTeam?.teamName,
  //           totalPoints: 3,
  //           totalGames: 1,
  //           totalVictories: 1,
  //           totalDraws: 0,
  //           totalLosses: 0,
  //           goalsFavor: match.homeTeamGoals,
  //           goalsOwn: match.awayTeamGoals,
  //         };
  //         leaderboard.push(newItem);
  //       }
  //     });

  //   // empate
  //   allMatches
  //     .filter(({ homeTeamGoals, awayTeamGoals }) => (homeTeamGoals === awayTeamGoals))
  //     .map((match) => {
  //       const existingTeam = leaderboard.find(({ name }) => name === match.homeTeam?.teamName);

  //       if (existingTeam) {
  //         // Se o time já existe no leaderboard, atualize os pontos.
  //         existingTeam.totalPoints += 1;
  //         existingTeam.totalGames += 1;
  //         existingTeam.totalDraws += 1;
  //         existingTeam.goalsFavor += match.homeTeamGoals;
  //         existingTeam.goalsOwn += match.awayTeamGoals;
  //       } else {
  //         // Caso contrário, crie um novo item no leaderboard.
  //         const newItem = {
  //           name: match.homeTeam?.teamName,
  //           totalPoints: 1,
  //           totalGames: 1,
  //           totalVictories: 0,
  //           totalDraws: 1,
  //           totalLosses: 0,
  //           goalsFavor: match.homeTeamGoals,
  //           goalsOwn: match.awayTeamGoals,
  //         };
  //         leaderboard.push(newItem);
  //       }
  //     });

  //   // derrota
  //   allMatches
  //     .filter(({ homeTeamGoals, awayTeamGoals }) => (homeTeamGoals < awayTeamGoals))
  //     .map((match) => {
  //       const existingTeam = leaderboard
  //         .find(({ name }) => name === match.homeTeam?.teamName);

  //       if (existingTeam) {
  //         // Se o time já existe no leaderboard, atualize os pontos.
  //         existingTeam.totalGames += 1;
  //         existingTeam.totalLosses += 1;
  //         existingTeam.goalsFavor += match.homeTeamGoals;
  //         existingTeam.goalsOwn += match.awayTeamGoals;
  //       } else {
  //         // Caso contrário, crie um novo item no leaderboard.
  //         const newItem = {
  //           name: match.homeTeam?.teamName,
  //           totalPoints: 0,
  //           totalGames: 1,
  //           totalVictories: 0,
  //           totalDraws: 0,
  //           totalLosses: 1,
  //           goalsFavor: match.homeTeamGoals,
  //           goalsOwn: match.awayTeamGoals,
  //         };
  //         leaderboard.push(newItem);
  //       }
  //     });

  //   return { status: 'SUCCESSFUL', data: leaderboard };
  // }

  public async getAll(): Promise<ServiceResponse<ILeaderboard[]>> {
    const statusGame = 'false';
    const allMatches = await this.matchModel.findAll(statusGame);

    const leaderboard: ILeaderboard[] = [];

    this.calculateLeaderboardForWins(allMatches, leaderboard);
    this.calculateLeaderboardForDraws(allMatches, leaderboard);
    this.calculateLeaderboardForLosses(allMatches, leaderboard);

    return { status: 'SUCCESSFUL', data: leaderboard };
  }

  private calculateLeaderboardForWins = (allMatches: IMatchAdapter[], leaderboard: ILeaderboard[])
  : void => {
    allMatches.filter(({ homeTeamGoals, awayTeamGoals }) => (homeTeamGoals > awayTeamGoals))
      .forEach(({ homeTeamGoals, awayTeamGoals, homeTeam }) => {
        const existing = leaderboard.find(({ name }) => name === homeTeam?.teamName);

        if (existing) {
          existing.totalPoints += 3; existing.totalGames += 1; existing.totalVictories += 1;
          existing.goalsFavor += homeTeamGoals; existing.goalsOwn += awayTeamGoals;
        } else {
          const newItem = { name: homeTeam?.teamName as string,
            totalPoints: 3,
            totalGames: 1,
            totalVictories: 1,
            totalDraws: 0,
            totalLosses: 0,
            goalsFavor: homeTeamGoals,
            goalsOwn: awayTeamGoals }; leaderboard.push(newItem);
        }
      });
  };

  private calculateLeaderboardForDraws = (allMatches: IMatchAdapter[], leaderboard: ILeaderboard[])
  : void => {
    allMatches.filter(({ homeTeamGoals, awayTeamGoals }) => (homeTeamGoals === awayTeamGoals))
      .forEach(({ homeTeamGoals, awayTeamGoals, homeTeam }) => {
        const existing = leaderboard.find(({ name }) => name === homeTeam?.teamName);

        if (existing) {
          existing.totalPoints += 1; existing.totalGames += 1; existing.totalDraws += 1;
          existing.goalsFavor += homeTeamGoals; existing.goalsOwn += awayTeamGoals;
        } else {
          const newItem = { name: homeTeam?.teamName as string,
            totalPoints: 1,
            totalGames: 1,
            totalVictories: 0,
            totalDraws: 1,
            totalLosses: 0,
            goalsFavor: homeTeamGoals,
            goalsOwn: awayTeamGoals }; leaderboard.push(newItem);
        }
      });
  };

  private calculateLeaderboardForLosses = (allMatches: IMatchAdapter[], leaderboard: ILeaderboard[])
  : void => {
    allMatches.filter(({ homeTeamGoals, awayTeamGoals }) => (homeTeamGoals < awayTeamGoals))
      .forEach(({ homeTeamGoals, awayTeamGoals, homeTeam }) => {
        const e = leaderboard.find(({ name }) => name === homeTeam?.teamName);

        if (e) {
          e.totalGames += 1; e.totalLosses += 1;
          e.goalsFavor += homeTeamGoals; e.goalsOwn += awayTeamGoals;
        } else {
          const newItem = { name: homeTeam?.teamName as string,
            totalPoints: 0,
            totalGames: 1,
            totalVictories: 0,
            totalDraws: 0,
            totalLosses: 1,
            goalsFavor: homeTeamGoals,
            goalsOwn: awayTeamGoals }; leaderboard.push(newItem);
        }
      });
  };
}
