import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { ClsService, ClsServiceManager } from "nestjs-cls";
import { Observable } from "rxjs";

@Injectable()
export class UserContextInterceptor implements NestInterceptor {
    constructor(private readonly cls: ClsService) { }
    intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
        const request = context.switchToHttp().getRequest();
        const { id } = request.user; // đã được JWT guard inject
        if (id) {
            this.cls.set('userId', id)
        }
        const userId = ClsServiceManager.getClsService().get('userId');
        console.log("userId>>>>>>>>>>>>: ", userId);

        return next.handle()
    }
}