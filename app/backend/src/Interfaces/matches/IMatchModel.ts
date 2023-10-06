import { ID } from '..';
import { IMatchAdapter } from './IMatch';

export interface IMatchModel {
  findAll(statusGame: string): Promise<IMatchAdapter[]>
  update(id: ID): Promise<void>,
}
