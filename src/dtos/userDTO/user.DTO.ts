export interface CreateUserDTO {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  isActive?: boolean;
}

export interface UpdateUserDTO {
  email?: string;
  firstName?: string;
  lastName?: string;
  isActive?: boolean;
  isAdmin?: boolean;
}
