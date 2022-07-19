import { getReasonPhrase, ReasonPhrases, StatusCodes } from 'http-status-codes';

class TandainError extends Error {
	public name: string;
	public code: number;

	constructor(message: string, options: Partial<TandainError> = {}) {
		super(message);

		const { name, code } = options;
		const reasonPhrase = code && getReasonPhrase(code);

		this.name = name || reasonPhrase || ReasonPhrases.INTERNAL_SERVER_ERROR;
		this.code = code || StatusCodes.INTERNAL_SERVER_ERROR;

		Error.captureStackTrace(this);
	}
}

export default TandainError;
