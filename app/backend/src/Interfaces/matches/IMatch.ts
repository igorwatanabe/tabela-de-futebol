import { Identifiable } from '..';

// usuário completo
export interface IMatch extends Identifiable {
  homeTeamId: number
  homeTeamGoals: number
  awayTeamId: number
  awayTeamGoals: number
  inProgress: boolean
}

export type teamNameById = {
  teamName: string
};

export interface IMatchAdapter extends IMatch {
  homeTeam: teamNameById | undefined
  awayTeam: teamNameById | undefined
}

export interface IMatchCreate {
  homeTeamId: number
  homeTeamGoals: number
  awayTeamId: number
  awayTeamGoals: number
}

// usuário a ser retornado pela API
// export type IUserResponse = Omit<IMatch, 'password'>;
