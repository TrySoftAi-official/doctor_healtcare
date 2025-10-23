import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service';
import { UserRole } from '../../common/enums/user-role.enum';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      usernameField: 'email',
      passwordField: 'password',
    });
  }

  async validate(email: string, password: string, role: UserRole): Promise<any> {
    const user = await this.authService.validateUser(email, password, role);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
