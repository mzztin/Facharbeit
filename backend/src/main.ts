import { NestFactory } from "@nestjs/core";
import { AppModule } from "./modules/app/app.module";
import { NestExpressApplication } from "@nestjs/platform-express";
import { ValidationPipe } from "@nestjs/common/pipes";
import { MyAdapter } from "./utils";

(async () => {
	const app = await NestFactory.create<NestExpressApplication>(AppModule);

	app.useGlobalPipes(
		new ValidationPipe()
	);

	app.useWebSocketAdapter(new MyAdapter(app));

	app.enableCors({
		origin: "http://localhost:3000",
		credentials: true
	});

	await app.listen(4000);
})();
