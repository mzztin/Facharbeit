import { parse } from "dotenv";
import { readFileSync } from "fs";

interface Config {
	[key: string]: string;
}

export class ConfigService {
	private readonly config: Config;

	constructor(filePath: string = ".env") {
		this.config = parse(readFileSync(filePath));
	}

	public get(key: string): string | undefined {
		return this.config[key] ?? undefined;
	}
}
