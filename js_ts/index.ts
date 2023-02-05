import * as errors from  "./errors";

export interface BufferOutput {
	body: {
		filename: string,
		caption: string,
		content: string
	}
}

export interface HeadBufferOutput extends BufferOutput {
	header: {
		filename_size: number,
		caption_size: number
	}
}

export class CPTNBuffer {
	static MAGIC_NUMBER: string = 'CPTN\n';
	
	static filename_size?: number;
	static caption_size?: number;

	static header?: Buffer;

	static filename?: string;
	static caption?: string;
	static content?: string;

	/**
	 * Saves content, caption and filename to `CPTNBuffer`.
	 * 
	 * @param {string} content - The main content to be saved.
	 * @param {string} caption - A brief description of the content.
	 * @param {string} [filename=""] - The name of the original file where the data were stored (If the data weren't stored in a file, don't pass anything here).
	 */
	public static create_new(content: string, caption: string, filename: string = "") {
		const filename_size = filename.length;
		const caption_size = caption.length;

		if (filename_size >= 2**8) {
			throw new errors.SizeOverflow(`Filename size must be under ${2**8} bytes`);
		}
		if (caption_size >= 2**16) {
			throw new errors.SizeOverflow(`Caption size must be less than ${2**16} bytes`);
		}

		this.filename_size = filename_size;
		this.caption_size = caption_size;

		this.filename = filename;
		this.caption = caption;
		this.content = content;

		// Allocate a Buffer with a fixed length (the 9 in the beggining is for the 9-byte header)
		const header = Buffer.alloc(9 + filename_size + caption_size + content.length);
		header.write(this.MAGIC_NUMBER, 0);
		header.writeInt8(filename_size, 5);
		header.writeInt16BE(caption_size, 6);

		this.header = header;
	}


	/**
	 * Decodes the data in a `Buffer` object and saves it as class properties.
	 *
	 * @param {Buffer} buffer - The `Buffer` object containing the data to be decoded.
	 * @param {boolean} get_header - A flag indicating whether to include header data in the returned object.
	 * @returns {object} An object containing the decoded data. If `get_header` is `true`, the object will also include header data.
	 */
	public static read_from_bytes(buffer: Buffer, get_header?: boolean): BufferOutput | HeadBufferOutput {
		let magic_number = buffer.toString('utf8', 0, 5);
		if (magic_number != this.MAGIC_NUMBER) {
			throw new errors.NoMagicNumber("Expected magic number 0x4350544E0A in the beginning of the buffer provided");
		}

		const filename_size = buffer.readInt8(5);
		const caption_size = buffer.readInt16BE(6);

		const filename = buffer.toString('utf8', 8, 8+filename_size);
		const caption = buffer.toString('utf8', 8+filename_size, 8+filename_size+caption_size);
		const content = buffer.toString('utf8', 8+filename_size+caption_size);

		let output: BufferOutput | HeadBufferOutput = {
			body: {
				filename: filename,
				caption: caption,
				content: content
			}
		}

		this.header = buffer.subarray(0, 8);

		this.filename_size = filename_size;
		this.caption_size = caption_size;

		this.filename = filename;
		this.caption = caption;
		this.content = content;

		if (get_header) {
			Object.assign(output, {
				header: {
					filename_size: filename_size,
					caption_size: caption_size
				}
			})
		}

		return output;
	}

	/**
	 * Get Buffer object containing bytes to be written to a file following the CPTN format
	 */
	public static get_bytes() {
		if (
			this.header === undefined ||
			this.filename === undefined ||
			this.caption === undefined ||
			this.content === undefined
			) {
			throw new errors.UndefinedData("Not all of class properties are defined. Try passing some data to this CPTNBuffer before calling this method");
		}

		return (Buffer.concat([this.header, Buffer.from(this.filename + this.caption + this.content)]))
	}
}