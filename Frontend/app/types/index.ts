export interface User {
  _id: string;
  email: string;
  name: string;
  createdAt: Date;
  isEmailVerified: boolean;
  profilePicture?: string;
  updatedAt: Date;
}
export interface Workspace {
  _id: string;
  name: string;
  description?: string;
  owner: User | string;
  members: {
    user: User;
    role: "admin" | "member" | "owner" | "viewer";
    joinedAt: Date;
  }[];
  color: string;
  createdAt: Date;
  updatedAt: Date;
}
