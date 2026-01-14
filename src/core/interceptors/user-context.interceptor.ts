import { CallHandler, ExecutionContext, Injectable, Logger, NestInterceptor } from "@nestjs/common";
import { ClsService, ClsServiceManager } from "nestjs-cls";
import { Observable } from "rxjs";

@Injectable()
export class UserContextInterceptor implements NestInterceptor {
    private readonly logger = new Logger(UserContextInterceptor.name);
    constructor(private readonly cls: ClsService) { }
    intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
        const request = context.switchToHttp().getRequest();
        const { sub } = request.user; // đã được JWT guard inject
        if (sub) {
            this.cls.set('userId', sub)
        }
        const userId = ClsServiceManager.getClsService().get('userId');
        // this.logger.log("userId>>>>>>>>>>>>: ", userId);

        return next.handle()
    }
}