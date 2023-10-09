import { ServiceResponse } from '../Interfaces/ServiceResponse';
import { ILeaderboard, ILeaderboardStatistics } from '../Interfaces/leaderboards/ILeaderboard';
import { IMatchAdapter } from '../Interfaces/matches/IMatch';
import { IMatchModel } from '../Interfaces/matches/IMatchModel';
import MatchModel from '../models/MatchModel';

export default class MatchService {
  constructor(
    // private leaderboardModel: ILeaderboardModel = new LeaderboardModel(),
    private matchModel: IMatchModel = new MatchModel(),
  ) { }

  public async getAllHome(): Promise<ServiceResponse<ILeaderboard[]>> {
    const statusGame = 'false';
    const allMatches = await this.matchModel.findAll(statusGame);

    const leaderboard: ILeaderboard[] = [];

    this.calcLeaderboardForWinsHome(allMatches, leaderboard);
    this.calcLeaderboardForDrawsHome(allMatches, leaderboard);
    this.calcLeaderboardForLosses(allMatches, leaderboard);
    const updatedBoard = this.calculateLeaderboardStatistics(leaderboard);
    this.leaderboardOrder(updatedBoard as ILeaderboardStatistics[]);

    return { status: 'SUCCESSFUL', data: updatedBoard };
  }

  private calcLeaderboardForWinsHome = (allMatches: IMatchAdapter[], leaderboard: ILeaderboard[])
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

  private calcLeaderboardForDrawsHome = (allMatches: IMatchAdapter[], leaderboard: ILeaderboard[])
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

  private calcLeaderboardForLosses = (allMatches: IMatchAdapter[], leaderboard: ILeaderboard[])
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

  private calculateLeaderboardStatistics = (leaderboard: ILeaderboard[])
  : ILeaderboard[] => leaderboard.map((board) => {
    const updatedBoard = { ...board };

    const goalsBalance = updatedBoard.goalsFavor - updatedBoard.goalsOwn;
    const efficiency = (updatedBoard.totalPoints / (updatedBoard.totalGames * 3)) * 100;

    updatedBoard.goalsBalance = goalsBalance;
    updatedBoard.efficiency = `${efficiency.toFixed(2)}`;

    return updatedBoard;
  });

  private leaderboardOrder = (updatedBoard:ILeaderboardStatistics[]):void => {
    updatedBoard.sort((teamA, teamB) => {
      if (teamB.totalPoints !== teamA.totalPoints) {
        return teamB.totalPoints - teamA.totalPoints;
      }
      if (teamB.totalVictories !== teamA.totalVictories) {
        return teamB.totalVictories - teamA.totalVictories;
      }
      if (teamB.goalsBalance !== teamA.goalsBalance) {
        return teamB.goalsBalance - teamA.goalsBalance;
      }
      return teamB.goalsFavor - teamA.goalsFavor;
    });
  };

  public async getAllAway(): Promise<ServiceResponse<ILeaderboard[]>> {
    const statusGame = 'false';
    const allMatches = await this.matchModel.findAll(statusGame);

    const leaderboard: ILeaderboard[] = [];

    this.calcLeaderboardForWinsAway(allMatches, leaderboard);
    this.calcLeaderboardForDrawsAway(allMatches, leaderboard);
    this.calcLeaderboardForLossesAway(allMatches, leaderboard);
    const updatedBoard = this.calculateLeaderboardStatistics(leaderboard);
    this.leaderboardOrder(updatedBoard as ILeaderboardStatistics[]);

    return { status: 'SUCCESSFUL', data: updatedBoard };
  }

  private calcLeaderboardForWinsAway = (allMatches: IMatchAdapter[], leaderboard: ILeaderboard[])
  : void => {
    allMatches.filter(({ homeTeamGoals, awayTeamGoals }) => (homeTeamGoals < awayTeamGoals))
      .forEach(({ homeTeamGoals, awayTeamGoals, awayTeam }) => {
        const existing = leaderboard.find(({ name }) => name === awayTeam?.teamName);

        if (existing) {
          existing.totalPoints += 3; existing.totalGames += 1; existing.totalVictories += 1;
          existing.goalsFavor += awayTeamGoals; existing.goalsOwn += homeTeamGoals;
        } else {
          const newItem = { name: awayTeam?.teamName as string,
            totalPoints: 3,
            totalGames: 1,
            totalVictories: 1,
            totalDraws: 0,
            totalLosses: 0,
            goalsFavor: awayTeamGoals,
            goalsOwn: homeTeamGoals }; leaderboard.push(newItem);
        }
      });
  };

  private calcLeaderboardForDrawsAway = (allMatches: IMatchAdapter[], leaderboard: ILeaderboard[])
  : void => {
    allMatches.filter(({ homeTeamGoals, awayTeamGoals }) => (homeTeamGoals === awayTeamGoals))
      .forEach(({ homeTeamGoals, awayTeamGoals, awayTeam }) => {
        const existing = leaderboard.find(({ name }) => name === awayTeam?.teamName);

        if (existing) {
          existing.totalPoints += 1; existing.totalGames += 1; existing.totalDraws += 1;
          existing.goalsFavor += awayTeamGoals; existing.goalsOwn += homeTeamGoals;
        } else {
          const newItem = { name: awayTeam?.teamName as string,
            totalPoints: 1,
            totalGames: 1,
            totalVictories: 0,
            totalDraws: 1,
            totalLosses: 0,
            goalsFavor: awayTeamGoals,
            goalsOwn: homeTeamGoals }; leaderboard.push(newItem);
        }
      });
  };

  private calcLeaderboardForLossesAway = (allMatches: IMatchAdapter[], leaderboard: ILeaderboard[])
  : void => {
    allMatches.filter(({ homeTeamGoals, awayTeamGoals }) => (homeTeamGoals > awayTeamGoals))
      .forEach(({ homeTeamGoals, awayTeamGoals, awayTeam }) => {
        const e = leaderboard.find(({ name }) => name === awayTeam?.teamName);

        if (e) {
          e.totalGames += 1; e.totalLosses += 1;
          e.goalsFavor += awayTeamGoals; e.goalsOwn += homeTeamGoals;
        } else {
          const newItem = { name: awayTeam?.teamName as string,
            totalPoints: 0,
            totalGames: 1,
            totalVictories: 0,
            totalDraws: 0,
            totalLosses: 1,
            goalsFavor: awayTeamGoals,
            goalsOwn: homeTeamGoals }; leaderboard.push(newItem);
        }
      });
  };
}
