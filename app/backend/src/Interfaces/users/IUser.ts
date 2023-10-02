import { Identifiable } from '..';

// usuário existente para login
export interface ILogin {
  username: string;
  password: string;
}

// usuário completo
export interface IUser extends Identifiable, ILogin {
  role: string
  email: string
}

// usuário a ser retornado pela API
export type IUserResponse = Omit<IUser, 'password'>;
