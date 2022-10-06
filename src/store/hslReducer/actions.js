import { SELECT_HSL, STARTED_HSL, RESET_VALUE_OF_HSL, REFORMAT_FORMATS, GET_NEW_DEFAULT_FORMAT } from './types.js'

export function selectHSL (actualValue) {
	return {
		type: SELECT_HSL,
		payload: actualValue
	}
}

export function resetValueOfHSL (resettingKey) {
	return {
		type: RESET_VALUE_OF_HSL,
		payload: resettingKey
	}
}

export function getNewDefaultColorToCopy (actualValue) {
	return {
		type: GET_NEW_DEFAULT_FORMAT,
		payload: actualValue
	}
}