export interface IUserRequest {
  id: string;
  name: string;
  email: string;
  password: string;
  role: 'user' | 'admin';
}