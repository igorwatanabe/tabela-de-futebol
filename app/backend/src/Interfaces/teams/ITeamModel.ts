import { ICRUDModelReaderAll, ICRUDModelReaderById } from '../ICRUDModel';
import { ITeam } from './ITeam';

export interface ITeamModel extends ICRUDModelReaderAll<ITeam>, ICRUDModelReaderById<ITeam>{ }
