import { generateOrderByQuery, getInsertValue, joinQuery } from './model';
import { ObjectQuery } from './model.types';

describe('utils/model', () => {
	describe('joinQuery', () => {
		it('should merge object to string with ", " separator', () => {
			const obj = {
				revoked_by_ip: '127.0.0.1',
				revoked_at: '2022-07-05T13:11:35.643Z',
				replaced_by:
					'wQCrr7aAgb5dDbGPhNWuLInhgX98WABWwOWWWX7ShNuS8OHg5EDvUbPZ1g0NhPpQ',
			};

			const result = joinQuery(obj);

			expect(result).toEqual(
				`revoked_by_ip='${obj.revoked_by_ip}', revoked_at='${obj.revoked_at}', replaced_by='${obj.replaced_by}'`
			);
		});

		it('should merge object to string with " AND " separator', () => {
			const obj = {
				revoked_by_ip: '127.0.0.1',
				revoked_at: '2022-07-05T13:11:35.643Z',
				replaced_by:
					'wQCrr7aAgb5dDbGPhNWuLInhgX98WABWwOWWWX7ShNuS8OHg5EDvUbPZ1g0NhPpQ',
			};

			const result = joinQuery(obj, ' AND ');

			expect(result).toEqual(
				`revoked_by_ip='${obj.revoked_by_ip}' AND revoked_at='${obj.revoked_at}' AND replaced_by='${obj.replaced_by}'`
			);
		});

		it('should merge object to string and set the null value to "IS NULL"', () => {
			const obj = {
				revoked_by_ip: '127.0.0.1',
				revoked_at: '2022-07-05T13:11:35.643Z',
				replaced_by: null,
			};

			const result = joinQuery(obj, ' AND ');

			expect(result).toEqual(
				`revoked_by_ip='${obj.revoked_by_ip}' AND revoked_at='${obj.revoked_at}' AND replaced_by IS NULL`
			);
		});
	});

	describe('getInsertValues', () => {
		it('should return columns from object key and values from object property values', () => {
			const obj: ObjectQuery = {
				id: null,
				fullname: 'Test',
				email: 'test@test.com',
				phone_number: 8123456789,
				country: 'Indonesia',
			};

			const { columns, values } = getInsertValue(obj);

			const keys = Object.keys(obj);
			const mockValues = keys.map((key) => {
				return obj[key] ? `'${obj[key]}'` : 'null';
			});

			expect(columns.split(', ')).toEqual(keys);
			expect(values.split(', ')).toEqual(mockValues);
		});
	});

	describe('generateOrderByQuery', () => {
		it('should generate string based on order by object', () => {
			const obj = {
				id: 'asc',
				name: 'desc',
			};

			const orderByStr = generateOrderByQuery(obj);

			expect(orderByStr).toEqual('id ASC, name DESC');
		});
	});
});
