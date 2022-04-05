import { IsDefined, IsIn, IsOptional, IsString } from 'class-validator';

export class OpenAccountDto {
  @IsString()
  @IsDefined()
  bvn: string;

  @IsString()
  @IsDefined()
  name_on_account: string;

  @IsString()
  @IsOptional()
  middlename: string;

  @IsString()
  @IsDefined()
  dob: string;

  @IsIn(['M', 'F'])
  gender: 'M' | 'F';

  @IsIn(['Mr', 'Mrs', 'Ms'])
  title: 'Mr' | 'Mrs' | 'Ms';

  @IsString()
  @IsOptional()
  address_line_1: string;

  @IsString()
  @IsOptional()
  address_line_2: string;

  @IsString()
  city: string;

  @IsString()
  state: string;

  country: 'NG';
}
