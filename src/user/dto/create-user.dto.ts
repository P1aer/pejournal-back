import { IsEmail, Length } from 'class-validator';

export class CreateUserDto {
  @Length(4)
  name: string;
  @IsEmail(undefined, { message: 'Неверная почта' })
  email: string;
  @Length(6, 32, { message: 'Пароль должен быть от 6 до 32 символов' })
  password?: string;
}
