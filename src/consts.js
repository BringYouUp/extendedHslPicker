import { getFormatted } from '@utils/utils.js'

const INITIAL_HUE = 180
const INITIAL_SATURATION = 100
const INITIAL_LIGHTNESS = 50
const INITIAL_FORMAT_TO_COPY = 'hsl'

const { hsl, rgb, hex } = getFormatted(INITIAL_HUE, INITIAL_SATURATION, INITIAL_LIGHTNESS )

const INITIAL_STATE = {
	hue: INITIAL_HUE,
	saturation: INITIAL_SATURATION,
	lightness: INITIAL_LIGHTNESS,
	defaultFormatToCopy: INITIAL_FORMAT_TO_COPY,
}

const COPIED_COLOR_HISTORY = {
	hsl, rgb, hex
}

export { INITIAL_HUE, INITIAL_SATURATION, INITIAL_LIGHTNESS, INITIAL_STATE, COPIED_COLOR_HISTORY }