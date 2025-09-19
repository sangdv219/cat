import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { ClsService } from "nestjs-cls";
import { Observable } from "rxjs";

@Injectable()
export class UserContextInterceptor implements NestInterceptor {
    constructor(private readonly cls: ClsService) { }
    intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
        const request = context.switchToHttp().getRequest();
        const {id} = request.user; // đã được JWT guard inject
        console.log("id: ", id);

        if(id){
            this.cls.set('userId', id)
        }

        return next.handle()
    }
}