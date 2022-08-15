import { getFormatted, getStartedColor } from '@utils/utils.js'

const { hue = 0, saturation = 100, lightness = 50, defaultFormatToCopy = 'hsl'} = getStartedColor()

export const INITIAL_HUE = 0
export const INITIAL_SATURATION = 100
export const INITIAL_LIGHTNESS = 50
export const INITIAL_FORMAT_TO_COPY = 'hsl'

export const LS_MAIN_KEY = 'state'

const { hsl, rgb, hex } = getFormatted(hue, saturation, lightness )

export const MAIN_FORMATS = ['hsl', 'rgb', 'hex']

export const INITIAL_HSL_REDUCER = {
	hue: INITIAL_HUE,
	saturation: INITIAL_SATURATION,
	lightness: INITIAL_LIGHTNESS,
	defaultFormatToCopy: INITIAL_FORMAT_TO_COPY,
}

export const STARTED_HSL_REDUCER = {
	hue,
	saturation,
	lightness,
	defaultFormatToCopy,
}

export const INITIAL_COPIED_COLOR_REDUCER = {
	hsl,
	rgb,
	hex,
	textFromClipboard: null,
	isTheSameTextInClipboard: false,
	isTheSameUrlInClipboard: false,
}
