import { ICRUDModelReader } from '../ICRUDModel';
import { ITeam } from './ITeam';

export interface ITeamModel extends ICRUDModelReader<ITeam>{
  findAll(): Promise<ITeam[]>
}
