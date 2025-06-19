// src/statement/auth/role.decorator.ts
import { SetMetadata } from '@nestjs/common';
import { Role } from '../../utils/roles.enum'; // adjust path if needed

export const ROLES_KEY = 'roles';
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);
