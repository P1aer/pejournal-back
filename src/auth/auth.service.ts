import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { UserEntity } from '../user/entities/user.entity';
import { CreateUserDto } from '../user/dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userService.findByCond({
      email,
      password,
    });
    if (user && user.password === password) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: UserEntity) {
    const { password, ...result } = user;
    const payload = { email: user.email, sub: user.id };
    return {
      ...result,
      token: this.jwtService.sign(payload),
    };
  }
  async register(dto: CreateUserDto) {
    const { password, ...user } = await this.userService.create({
      name: dto.name,
      email: dto.email,
      password: dto.password,
    });
    const payload = { email: user.email, sub: user.id };
    return {
      ...user,
      token: this.jwtService.sign(payload),
    };
  }
}
