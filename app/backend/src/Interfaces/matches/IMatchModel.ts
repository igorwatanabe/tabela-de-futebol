import { ICRUDModelReaderAll } from '../ICRUDModel';
import { IMatch, IMatchAdapter } from './IMatch';

export interface IMatchModel extends ICRUDModelReaderAll<IMatch>{
  findAll(statusGame: string): Promise<IMatchAdapter[]>
}
