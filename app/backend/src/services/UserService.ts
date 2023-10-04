import * as bcrypt from 'bcryptjs';
import { IToken } from '../Interfaces/IToken';
import {
  ServiceMessage,
  ServiceResponse,
  ServiceResponseSuccess,
} from '../Interfaces/ServiceResponse';
import { ILogin, IUser } from '../Interfaces/users/IUser';
import { IUserModel } from '../Interfaces/users/IUserModel';
import UserModel from '../models/UserModel';
import JWT from '../utils/JWT';

export default class UserService {
  constructor(
    private userModel: IUserModel = new UserModel(),
    private jwtService = JWT,
  ) { }

  public async login(data: ILogin): Promise<ServiceResponse<ServiceMessage | IToken>> {
    const user = await this.userModel.findByEmail(data.email);

    if (user) {
      if (!bcrypt.compareSync(data.password, user.password)) {
        return { status: 'UNAUTHORIZED', data: { message: 'Invalid email or password' } };
      }
      const { email } = user as IUser;
      const token = this.jwtService.sign({ email });
      return { status: 'SUCCESSFUL', data: { token } };
    }
    return { status: 'UNAUTHORIZED', data: { message: 'Invalid email or password' } };
    // { message: 'User not found' }
  }

  public async findRole(email: string): Promise<ServiceResponseSuccess<object>> {
    const user = await this.userModel.findByEmail(email);
    const { role } = user as IUser;

    return { status: 'SUCCESSFUL', data: { role } };
  }
}
