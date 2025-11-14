export class APIError extends Error {
	constructor(public message: string) {
		super(message);
		this.name = "ApiError";
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
