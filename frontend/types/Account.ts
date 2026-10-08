import { User } from "./User";

export interface Account {
    id: string;
    user: User;
    balance: number;
    status: string;
    createdAt: string;
    updatedAt: string;
}