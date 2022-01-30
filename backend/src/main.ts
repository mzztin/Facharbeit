import { NestFactory } from "@nestjs/core";
import { NestExpressApplication } from "@nestjs/platform-express";
import { IoAdapter } from "@nestjs/platform-socket.io";
import "reflect-metadata";
import { AppModule } from "./modules/app/app.module";

(async () => {
	const app = await NestFactory.create<NestExpressApplication>(AppModule);
    app.set('trust proxy', 1);
	app.useWebSocketAdapter(new IoAdapter(app));

	app.enableCors({
		origin: ["localhost", "http://192.168.1.53:3000"],
		credentials: true		
	})

	await app.listen(4000, "0.0.0.0");
})();
