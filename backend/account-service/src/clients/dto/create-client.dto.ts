import { IsEmail, IsIn, IsNotEmpty, IsOptional, IsString, Matches } from 'class-validator';
import { CLIENT_STATUSES, ClientStatus } from '../client.entity';

export class CreateClientDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^(\d{11}|\d{14})$/)
  document: string;

  @IsOptional()
  @IsIn(CLIENT_STATUSES)
  status?: ClientStatus;
}
