export default interface Admin {
  id: string;
  password?: string;
  username: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}
