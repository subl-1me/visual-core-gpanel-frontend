export default interface Admin {
  id: string;
  password?: string;
  username?: string;
  name: string;
  lastName: string;
  email: string;
  createdAt?: Date;
  updatedAt?: Date;
}
