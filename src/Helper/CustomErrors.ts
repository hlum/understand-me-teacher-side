export class APIError extends Error {
	constructor(
		message: string,
		public readonly errorCode: string = "UNKNOWN"
	) {
		super(message);
		this.name = "APIError";
	}
}

export class DataParseError extends Error {
	constructor(message: string) {
		super(message);
		this.name = "DataParseError";
	}
}

export class NetworkError extends Error {
	constructor(message: string) {
		super(message);
		this.name = "NetworkError";
	}
}

export class AuthenticationError extends Error {
	constructor(message: string) {
		super(message);
		this.name = "AuthenticationError";
	}
}
