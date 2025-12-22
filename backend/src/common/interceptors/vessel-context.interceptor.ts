import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { UserRole } from '../../entities/user.entity';

@Injectable()
export class VesselContextInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (user) {
      // For SYSTEM_ADMIN and DPA_OFFICE, vesselId can be from query/params
      // For others, always use their own vesselId
      if (user.role === UserRole.SYSTEM_ADMIN || user.role === UserRole.DPA_OFFICE) {
        request.vesselId = request.query?.vesselId || request.params?.vesselId || user.vesselId;
      } else {
        request.vesselId = user.vesselId;
      }
    }

    return next.handle();
  }
}

