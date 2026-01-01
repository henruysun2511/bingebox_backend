import { IUserRequest } from '../../types/userRequest';

interface IBaseService<TInput, T> {
  create(data: TInput, user: IUserRequest): Promise<T>;
  update(id: string, data: TInput, user: IUserRequest): Promise<TInput | null>;
  remove(id: string, user: IUserRequest): Promise<string | null>;
  getDetailById(id: string): Promise<TInput | null>;
}
export { type IBaseService };

