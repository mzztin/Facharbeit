import { readFileSync } from "fs";
import { parse } from "dotenv";

interface Config {
	[key: string]: string;
}

export class ConfigService {
	private readonly config: Config;

	constructor(filePath: string) {
		this.config = parse(readFileSync(filePath));
	}

	public get(key: string): string | undefined {
		return this.config[key] ?? undefined;
	}
}
