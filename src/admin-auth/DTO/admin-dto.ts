export class AdminDto {
  email: string;
  fullname: string;
  password: string;
  avatar: string;
  position: string;
  active: boolean;
}

export enum STATUS {
  ACTIVE = 1,
  INACTIVE = 2,
}
