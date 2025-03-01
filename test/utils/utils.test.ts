import { describe, it, expect } from 'vitest';
import { sleep, getGapLine, getErrorMessages, throwResponseError, splitText, isOverMaxCharacterNum } from '../../src/utils/utils';
import { TranslationError } from '../../src';

describe('utils tests', () => {
	it('should delay for specified milliseconds', async () => {
		const start = Date.now();
		await sleep(100);
		const end = Date.now();
		expect(end - start).toBeGreaterThanOrEqual(100);
	});

	it('should return a gap line of 20 dashes', () => {
		expect(getGapLine()).toBe('--------------------');
	});

	it('should return error message with prefix for TypeError', () => {
		const error = new TypeError('Type error occurred');
		expect(getErrorMessages(error)).toBe('Translate fail ! Type error occurred');
	});

	it('should return error message with prefix for general Error', () => {
		const error = new Error('General error occurred');
		expect(getErrorMessages(error)).toBe('Translate fail ! General error occurred');
	});

	it('should throw response error with correct message', async () => {
		const mockResponse = {
			status: 404,
			statusText: 'Not Found',
			json: async () => ({ message: 'Resource not found' })
		};
		const error = await throwResponseError('TestError', mockResponse);
		expect(error).toBeInstanceOf(TranslationError);
		expect(error.message).toBe('Translate fail ! 404: Not Found Resource not found');
	});

	it('should split english text correctly based on max character number', () => {
		const text = 'This is a test text. It should be split correctly.';
		const result = splitText(text, 10);
		expect(result).toEqual(['This is a', ' test', ' text. It', ' should', ' be split', "correctly."]);
	});

	it('should split chinese text correctly based on max character number', () => {
		const text = '这是一个测试文本，应能正确分割。测试一下看看效果如何.';
		const result = splitText(text, 10);
		expect(result).toEqual(['这是一个测试文本', '，应能正确分割', '。测试一下看看效果如', "何."]);
	});

	it('should return false if text array is empty or null', () => {
		expect(isOverMaxCharacterNum([], 10)).toBe(false);
		expect(isOverMaxCharacterNum(null, 10)).toBe(false);
	});

	it('should return true if total characters exceed max character number', () => {
		const text = ['This', 'is', 'a', 'test'];
		expect(isOverMaxCharacterNum(text, 10)).toBe(true);
	});

	it('should return false if total characters do not exceed max character number', () => {
		const text = ['This', 'is', 'a', 'test'];
		expect(isOverMaxCharacterNum(text, 20)).toBe(false);
	});
});
