import { SELECT_HSL, RESET_VALUE_OF_HSL, REFORMAT_FORMATS, GET_RANDOM_COLOR, GET_NEW_DEFAULT_FORMAT } from './types.js'

import { INITIAL_HUE, INITIAL_SATURATION, INITIAL_LIGHTNESS, INITIAL_ALPHA } from './../../consts.js'

function selectHSL (actualValue) {
	return {
		type: SELECT_HSL,
		data: actualValue
	}
}

function resetValueOfHSL (resettingKey) {
	return {
		type: RESET_VALUE_OF_HSL,
		data: resettingKey
	}
}

function getRandomColor () {
	return {
		type: GET_RANDOM_COLOR,
	}
}

function getNewDefaultColorToCopy (actualValue) {
	return {
		type: GET_NEW_DEFAULT_FORMAT,
		data: actualValue
	}
}

export { selectHSL, resetValueOfHSL, getRandomColor, getNewDefaultColorToCopy }