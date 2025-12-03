import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.usersService.findOneByEmail(email);
    if (!user) {
      console.warn('[auth] user not found for email', email);
      return null;
    }
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) {
      console.warn('[auth] invalid password for email', email);
      return null;
    }
    return { id: user.id, email: user.email, is_admin: user.is_admin };
  }

  async login(user: any) {
    const payload = {
      email: user.email,
      sub: user.id,
      is_admin: user.is_admin,
    };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
