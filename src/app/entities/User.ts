export enum UserRole {
    MANAGER = "manager",
    EMPLOYEE = "employee",
}
export type User = {
  id: number;
  firstName: string;
  lastName: string;
  fullName: string;
  role: UserRole;
}