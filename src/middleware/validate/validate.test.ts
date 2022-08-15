import { NextFunction, Request, Response } from 'express';

import { validateObj, validateQuery } from './validate';

describe('middleware', () => {
	let mockRequest: Partial<Request>;
	let mockResponse: Partial<Response>;
	let nextFunction: NextFunction = jest.fn();

	beforeEach(() => {
		mockRequest = {};
		mockResponse = {
			status: jest.fn().mockReturnThis(), // NOTE: Chain methods mocking
			send: jest.fn(),
		};
	});

  describe('validateObj', () => {
    it('should return true if the values fulfill required keys', () => {
      const keys = ['id', 'name', 'country']
      const values = {
        id: 1,
        name: 'Test',
        country: 'Indonesia',
        phoneNumber: 8123123123
      }

      const validated = validateObj(values, keys)

      expect(validated).toEqual(true)
    })

    it('should return true if the values fulfill required keys even there is duplication in keys', () => {
      const keys = ['id', 'name', 'country', 'id']
      const values = {
        id: 1,
        name: 'Test',
        country: 'Indonesia',
        phoneNumber: 8123123123
      }

      const validated = validateObj(values, keys)

      expect(validated).toEqual(true)
    })

    it('should return true if the array is empty', () => {
      const values = {
        id: 1,
        name: 'Test',
        country: 'Indonesia',
        phoneNumber: 8123123123
      }

      const validated = validateObj(values, [])

      expect(validated).toEqual(true)
    })

    it('should return array of required value', () => {
      const keys = ['id', 'name', 'country', 'phoneNumber']
      const values = {
        id: 1,
        name: 'Test',
      }

      const validated = validateObj(values, keys)

      expect(validated).toEqual(['country', 'phoneNumber'])
    })
  })

	describe('validateQuery', () => {
		it('should call next function if the query params fulfill required properties', () => {
			const middlewareFn = validateQuery(['id', 'name', 'country']);

			mockRequest = {
				query: {
					id: '1',
					name: 'Test',
          country: 'Indonesia',
          phoneNumber: '8123123123',
				},
			};

			middlewareFn(
				mockRequest as Request,
				mockResponse as Response,
				nextFunction
			);

			expect(nextFunction).toHaveBeenCalled();
		});

		it('should call next function if validateQuery args array is empty', () => {
			const middlewareFn = validateQuery([]);

			mockRequest = {
				query: {
					id: '1',
					name: 'Test',
          country: 'Indonesia',
          phoneNumber: '8123123123',
				},
			};

			middlewareFn(
				mockRequest as Request,
				mockResponse as Response,
				nextFunction
			);

			expect(nextFunction).toHaveBeenCalled();
		});

		it('should return single required parameter error', () => {
			const middlewareFn = validateQuery(['id', 'name', 'country']);

			mockRequest = {
				query: {
					id: '1',
					name: 'Test',
          phoneNumber: '8123123123',
				},
			};

			middlewareFn(
				mockRequest as Request,
				mockResponse as Response,
				nextFunction
			);

			expect(mockResponse.status).toHaveBeenCalledWith(400);
			expect(mockResponse.send).toHaveBeenCalledWith({
				code: 400,
				name: 'Bad Request',
				message: "Required parameter 'country' is required",
			});
		});

		it('should return multi required parameters error', () => {
			const middlewareFn = validateQuery(['id', 'name', 'country']);

			mockRequest = {
				query: {
					id: '1'
				},
			};

			middlewareFn(
				mockRequest as Request,
				mockResponse as Response,
				nextFunction
			);

			expect(mockResponse.status).toHaveBeenCalledWith(400);
			expect(mockResponse.send).toHaveBeenCalledWith({
				code: 400,
				name: 'Bad Request',
				message: "Required parameter 'name, country' are required",
			});
		});
	});
});
