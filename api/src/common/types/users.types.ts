import { Role } from "@prisma/client";

export  type CurrentUserPayload = { userId: string, type: string, role: Role };