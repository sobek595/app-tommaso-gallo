export enum UserRole {
    DIPENDENTE = "dipendente",
    REFERENTE = "referente",
}

export type User = {
    id: string;
    firstName: string;
    lastName: string;
    fullName: string;
    role: UserRole;
}