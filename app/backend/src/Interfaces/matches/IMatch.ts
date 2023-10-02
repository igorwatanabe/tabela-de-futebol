import { Identifiable } from '..';

// usuário completo
export interface IMatch extends Identifiable {
  homeTeamId: number
  homeTeamGoals: number
  awayTeamId: number
  awayTeamGoals: number
  inProgress: boolean
}

// usuário a ser retornado pela API
// export type IUserResponse = Omit<IMatch, 'password'>;
