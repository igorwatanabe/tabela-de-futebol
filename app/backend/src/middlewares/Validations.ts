import { NextFunction, Request, Response } from 'express';
import JWT from '../utils/JWT';

class Validations {
  static validateLogin(req: Request, res: Response, next: NextFunction): Response | void {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'All fields must be filled' });
    }
    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;

    if (password.length < 6 || !emailRegex.test(email)) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    next();
  }

  static async validateToken(req: Request, res: Response, next: NextFunction):
  Promise<Response | void> {
    const bearerToken = req.headers.authorization;
    if (!bearerToken) {
      return res.status(401).json({ message: 'Token not found' });
    }
    const [type, token] = bearerToken.split(' ');
    if (type !== 'Bearer') return res.status(401).json({ message: 'Token must be a valid token' });

    const validToken = JWT.verify(token);
    res.locals.user = validToken;

    if (validToken === 'Token must be a valid token') {
      return res.status(401).json({ message: validToken });
    }
    next();
  }

  // static validateUser(req: Request, res: Response, next: NextFunction): Response | void {
  //   const user = req.body;
  //   const requiredKeys = ['email', 'password'];
  //   const notFoundKey = requiredKeys.find((key) => !(key in user));
  //   if (notFoundKey) {
  //     return res.status(400).json({ message: `${notFoundKey} is required` });
  //   }

  //   next();
  // }
}

export default Validations;
