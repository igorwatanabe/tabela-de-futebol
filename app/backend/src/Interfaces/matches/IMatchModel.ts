import { ID } from '..';
import { IMatch, IMatchAdapter, IMatchCreate } from './IMatch';

export interface IMatchModel {
  findAll(statusGame: string): Promise<IMatchAdapter[]>
  update(id: ID): Promise<void>,
  updateMatchGoals(id:number, homeTeamGoals: number, awayTeamGoals: number)
  :Promise<void>
  findById(id:ID): Promise<IMatch | null>
  createMatch(data:IMatchCreate): Promise<IMatch>
}
