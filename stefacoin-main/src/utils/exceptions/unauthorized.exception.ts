import Exception from './exception';

export default class UnauthorizedException extends Exception {
  // #pegabandeira resolved
  constructor(message: string, status: number = 400) {
    super(message, status);
  }
}
