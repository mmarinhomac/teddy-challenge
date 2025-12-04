import {
  Body,
  Controller,
  Get,
  Headers,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBody, ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { Public } from '../common/decorators/public.decorator';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('login')
  @UseGuards(AuthGuard('local'))
  @ApiBody({ type: LoginDto })
  async login(@Request() req: any, @Body() _body: LoginDto) {
    return this.authService.login(req.user);
  }

  @Get('me')
  @ApiBearerAuth()
  async me(
    @Request() req: any,
    @Headers('authorization') authorization?: string
  ) {
    const token =
      authorization && authorization.toLowerCase().startsWith('bearer ')
        ? authorization.slice(7)
        : authorization ?? '';

    return {
      user: req.user,
      access_token: token,
    };
  }
}
