import type { User as PrismaUser } from '@prisma/client';
import type { User as PublicUser } from '@job-platform/contracts';

type PublicUserSource = Pick<
    PrismaUser,
    'id' | 'email' | 'firstName' | 'lastName' | 'role' | 'avatarUrl' | 'resumeUrl'
>;

export function toPublicUser(user: PublicUserSource): PublicUser {
    return {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        avatarUrl: user.avatarUrl,
        resumeUrl: user.resumeUrl,
    };
}