import { NestFactory } from "@nestjs/core";
import { NestExpressApplication } from "@nestjs/platform-express";
import { IoAdapter } from "@nestjs/platform-socket.io";
import "reflect-metadata";
import { AppModule } from "./modules/app/app.module";

(async () => {

	const app = await NestFactory.create<NestExpressApplication>(AppModule);

	app.useWebSocketAdapter(new IoAdapter(app));

	app.enableCors({
		origin: "http://localhost:3000",
		credentials: true
	});

	await app.listen(4000);
})();
