import { SELECT_HUE, SELECT_SATURATION, SELECT_LIGHTNESS, SELECT_ALPHA, RESET_HUE, RESET_SATURATION, RESET_LIGHTNESS, RESET_ALPHA, REFORMAT_FORMATS, GET_RANDOM_COLOR, GET_NEW_DEFAULT_FORMAT } from './types.js'

import { INITIAL_HUE, INITIAL_SATURATION, INITIAL_LIGHTNESS, INITIAL_ALPHA } from './../../consts.js'

function selectHue (actualValue) {
	return {
		type: SELECT_HUE,
		data: actualValue
	}
}

function selectSaturation (actualValue) {
	return {
		type: SELECT_SATURATION,
		data: actualValue
	}
}

function selectLightness (actualValue) {
	return {
		type: SELECT_LIGHTNESS,
		data: actualValue
	}
}

function selectAlpha (actualValue) {
	return {
		type: SELECT_ALPHA,
		data: actualValue
	}
}

function resetHue (INITIAL_HUE) {
	return {
		type: RESET_HUE,
		data: INITIAL_HUE,
	}
}
function resetSaturation (INITIAL_SATURATION) {
	return {
		type: RESET_SATURATION,
		data: INITIAL_SATURATION,
	}
}
function resetLightness (INITIAL_LIGHTNESS) {
	return {
		type: RESET_LIGHTNESS,
		data: INITIAL_LIGHTNESS,
	}
}
function resetAplha (INITIAL_ALPHA) {
	return {
		type: RESET_ALPHA,
		data: INITIAL_ALPHA,
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

export { selectHue, selectSaturation, selectLightness, selectAlpha, resetHue, resetSaturation, resetLightness, resetAplha, getRandomColor, getNewDefaultColorToCopy }