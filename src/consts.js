import { getFormatted, getInitialParams } from '@utils/utils.js'

const { hue = 0, saturation = 100, lightness = 50, defaultFormatToCopy = 'hsl'} = getInitialParams()

const INITIAL_HUE = hue
const INITIAL_SATURATION = saturation
const INITIAL_LIGHTNESS = lightness
const INITIAL_FORMAT_TO_COPY = 'hsl'

const LS_MAIN_KEY = 'state'

const { hsl, rgb, hex } = getFormatted(INITIAL_HUE, INITIAL_SATURATION, INITIAL_LIGHTNESS )

const INITIAL_STATE = {
	hue,
	saturation,
	lightness,
	defaultFormatToCopy,
}

const MAIN_FORMATS = ['hsl', 'rgb', 'hex']

const COPIED_COLOR_HISTORY = {
	hsl, rgb, hex, clipboard: null
}

export { LS_MAIN_KEY, MAIN_FORMATS, INITIAL_HUE, INITIAL_SATURATION, INITIAL_LIGHTNESS, INITIAL_STATE, COPIED_COLOR_HISTORY }