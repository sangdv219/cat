import { DynamicModule, Module } from "@nestjs/common";
import { ClientProxyFactory, Transport } from "@nestjs/microservices";

@Module({})
export class TcpModule {
    static register({ name, host, port }): DynamicModule {
        return {
            module: TcpModule,
            providers: [
                {
                    provide: name,
                    useFactory: () =>
                        ClientProxyFactory.create({
                            transport: Transport.TCP,
                            options: { host, port },
                        })
                }
            ],
            exports: [name]
        }
    }
}