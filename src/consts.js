import { getFormatted, getInitialParams } from '@utils/utils.js'

const { hue = 0, saturation = 100, lightness = 50, defaultFormatToCopy = 'hsl'} = getInitialParams()

export const INITIAL_HUE = +hue
export const INITIAL_SATURATION = +saturation
export const INITIAL_LIGHTNESS = +lightness
export const INITIAL_FORMAT_TO_COPY = 'hsl'

export const LS_MAIN_KEY = 'state'

const { hsl, rgb, hex } = getFormatted(INITIAL_HUE, INITIAL_SATURATION, INITIAL_LIGHTNESS )

export const MAIN_FORMATS = ['hsl', 'rgb', 'hex']

export const INITIAL_HSL_REDUCER = {
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
