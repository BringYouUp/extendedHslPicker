import { getFormatted, getStartedColor } from '@utils/utils.js'

export const INITIAL_HUE = 0
export const INITIAL_SATURATION = 100
export const INITIAL_LIGHTNESS = 50
export const INITIAL_FORMAT_TO_COPY = 'hsl'

export const STARTED_COLLECTION = 'users'

export const MAIN_FORMATS = ['hsl', 'rgb', 'hex']

export const INITIAL_HSL_REDUCER = {
	hue: INITIAL_HUE,
	saturation: INITIAL_SATURATION,
	lightness: INITIAL_LIGHTNESS,
	defaultFormatToCopy: INITIAL_FORMAT_TO_COPY,
}

export const STARTED_HSL_REDUCER = {
	hue: INITIAL_HUE,
	saturation: INITIAL_SATURATION,
	lightness: INITIAL_LIGHTNESS,
	defaultFormatToCopy: INITIAL_FORMAT_TO_COPY,
}

export const INITIAL_FIRESTORE_STATE = {
	favoriteColorsList: [],
	hsl: {
		hue: INITIAL_HUE,
		saturation: INITIAL_SATURATION,
		lightness: INITIAL_LIGHTNESS
	}
}

export const INITIAL_COPIED_COLOR_REDUCER = {
	textFromClipboard: null,
	isTheSameTextInClipboard: false,
	isTheSameUrlInClipboard: false,
}
