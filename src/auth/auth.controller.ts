import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { LocalAuthGuard } from './quards/local-auth.guard';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../user/dto/create-user.dto';;

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
  ) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  @Post('register')
  register(@Body() dto: CreateUserDto) {
    return this.authService.register(dto);
  }
}
