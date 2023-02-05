export class UndefinedData extends Error {
	constructor(message: string) {
		super(message);
		this.name = "NO_HEADER_BUFFER";
		this.message = message;
	}
}

export class SizeOverflow extends Error {
	constructor(message: string) {
		super(message);
		this.name = "SIZE_OVERFLOW";
		this.message = message;
	}
}

export class NoMagicNumber extends Error {
	constructor(message: string) {
		super(message);
		this.name = "NO_MAGIC_NUMBER";
		this.message = message;
	}
}