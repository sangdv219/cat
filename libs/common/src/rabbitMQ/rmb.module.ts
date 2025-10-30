import { DynamicModule, Module } from "@nestjs/common";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { RmqService } from "./rmb.service";

interface RmqModuleOptions{
    name: string;
}
@Module({
  providers: [RmqService],
  exports: [RmqService], 
})

export class RmqModule{
    static register({name}: RmqModuleOptions): DynamicModule{
        return {
            module: RmqModule,
            imports: [
                ClientsModule.registerAsync([
                    {
                        name,
                        imports: [RmqModule],
                        inject: [RmqService],
                        useFactory: (rmqService: RmqService) => ({
                                transport: Transport.RMQ,
                                options: {
                                    urls: [rmqService.getRabbitmqUri()],
                                    queue: `${name}_QUEUE`,
                                },
                        }),
                    },
                ]),
            ],
            exports: [ClientsModule],
        }
    }
}