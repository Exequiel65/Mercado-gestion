import {
  CallHandler,
  ExecutionContext,
  Injectable,
  InternalServerErrorException,
  NestInterceptor,
  NotFoundException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { Request } from 'express';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Domain } from 'src/settings/entities/domain.entity';

@Injectable()
export class EntityInterceptor implements NestInterceptor {
  constructor(
    @InjectRepository(Domain)
    private readonly domainRepo: Repository<Domain>
  ) { }

  async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
    let domainFromOrigin: string | undefined;
    const request = context.switchToHttp().getRequest<Request>();
    const origin = request.headers.origin;
    if (origin) {
      try {
        const url = new URL(origin);
        domainFromOrigin = url.hostname;
      } catch (err) {
        console.warn("Invalid origin format", origin);
      }
    }
    const domain = domainFromOrigin || request.headers.host?.split(':')[0];
    const entity = await this.domainRepo.findOne({ where: { domain, name: "Web", isActive: true } });

    if (!entity || !entity.isActive) {
      console.error(`No entity found for domain: ${domain}`);
      throw new InternalServerErrorException(`No entity found`);
    }

    request['entityId'] = entity.entityId;

    return next.handle();
  }
}
