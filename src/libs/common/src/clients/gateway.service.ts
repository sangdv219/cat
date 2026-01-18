import { ClientProxy } from "@nestjs/microservices";
import { BaseClientService } from "./base-client.service";
import { Inject, Injectable } from "@nestjs/common";
import { UUID } from "crypto";
import { SERVICES } from "../constants/services";

@Injectable()
export class GatewayService extends BaseClientService {
  constructor(client: ClientProxy) {
    super(client);
  }

  async getProductById(id: UUID) {
    return this.sendRequest<string, string>('get_product', id);
  }
}
