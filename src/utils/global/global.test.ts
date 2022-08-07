import { generateRandomString } from './global';

describe('utils/global', () => {
	describe('generateRandomString', () => {
		it('should generate random string', () => {
			const randomString = generateRandomString();

			expect(typeof randomString).toEqual('string');
		});

		it('should generate random string with length accordance by param', () => {
			const randomString = generateRandomString(128);

			expect(typeof randomString).toEqual('string');
			expect(randomString.length).toEqual(128);
		});
	});
});
