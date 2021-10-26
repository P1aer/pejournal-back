import { IsEmail, Length } from 'class-validator';
import { UniqueOnDatabase } from '../../auth/validations/UniqueValidation';
import { UserEntity } from '../entities/user.entity';

export class CreateUserDto {
  @Length(4)
  name: string;
  @IsEmail(undefined, { message: 'Неверная почта' })
  @UniqueOnDatabase(UserEntity, {
    message: 'Такая почта уже есть',
  })
  email: string;
  @Length(6, 32, { message: 'Пароль должен быть от 6 до 32 символов' })
  password?: string;
}
