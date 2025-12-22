import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { UserRole } from '../../entities/user.entity';

@Injectable()
export class VesselAccessGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const requestedVesselId = request.params?.vesselId || request.body?.vesselId || request.query?.vesselId;

    // SYSTEM_ADMIN and DPA_OFFICE can access all vessels
    if (user.role === UserRole.SYSTEM_ADMIN || user.role === UserRole.DPA_OFFICE) {
      return true;
    }

    // Other users can only access their own vessel
    if (requestedVesselId && requestedVesselId !== user.vesselId) {
      throw new ForbiddenException('You do not have access to this vessel');
    }

    // If no vesselId specified, use user's vesselId
    if (!requestedVesselId && user.vesselId) {
      request.vesselId = user.vesselId;
    }

    return true;
  }
}

