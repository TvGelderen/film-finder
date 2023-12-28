import type { User } from "~/types/auth/AuthTypes";

export const useAuth = () => useState<User | null>('user', () => null);
