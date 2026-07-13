import { Category } from "./Category";
import { User } from "./User";

export enum Status {
    PENDING = 'pending',
    APPROVED = 'approved',
    REJECTED = 'rejected'
}

export type PermissionRequest = {
    id?: string;
    userIdRequesting: User | string;
    categoryId: Category | string;
    userIdApproving?: User | string;
    dateRequested: Date;
    dateStart?: Date;
    dateEnd?: Date;
    motivation: string;
    dateEvaluation?: Date;
    status: Status;
}