import { getFormatted } from './services/services.js'

const INITIAL_HUE = 180
const INITIAL_SATURATION = 100
const INITIAL_LIGHTNESS = 50
const INITIAL_ALPHA = 1
const INITIAL_FORMAT_TO_COPY = 'hsla'

const { hsla, rgba, hexa } = getFormatted(INITIAL_HUE, INITIAL_SATURATION, INITIAL_LIGHTNESS, INITIAL_ALPHA)

const INITIAL_STATE = {
	hue: INITIAL_HUE,
	saturation: INITIAL_SATURATION,
	lightness: INITIAL_LIGHTNESS,
	alpha: INITIAL_ALPHA,
	defaultFormatToCopy: INITIAL_FORMAT_TO_COPY,
}

const COPIED_COLOR_HISTORY = {
	hsla, rgba, hexa
}

export { INITIAL_HUE, INITIAL_SATURATION, INITIAL_LIGHTNESS, INITIAL_ALPHA, INITIAL_STATE, COPIED_COLOR_HISTORY }