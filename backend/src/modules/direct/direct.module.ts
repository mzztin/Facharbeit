import { Module } from "@nestjs/common";
import { DirectController } from "./direct.controller";
import { DirectService } from "./direct.service";

@Module({
    controllers: [DirectController],
    exports: [DirectService],
    providers: [DirectService]
})
export class DirectModule {

}