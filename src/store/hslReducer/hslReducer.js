import { INITIAL_STATE, INITIAL_HUE, INITIAL_SATURATION, INITIAL_LIGHTNESS } from '@/consts.js'

import { SELECT_HSL, RESET_VALUE_OF_HSL, GET_RANDOM_COLOR, REFORMAT_FORMATS, GET_NEW_DEFAULT_FORMAT } from './types.js'

import { getRandomGeneratedNumber } from '@utils/utils.js'

export const hsl = (state, action) => {

	// console.log(action.type, state)

	state = state ? state : INITIAL_STATE

	switch (action.type) {
		case GET_RANDOM_COLOR:
			return {
				...state,
				hue: getRandomGeneratedNumber(361),
				saturation: getRandomGeneratedNumber(100, 25),
				lightness: getRandomGeneratedNumber(75, 25),
			}

		case GET_NEW_DEFAULT_FORMAT:
			return {
				...state,
				defaultFormatToCopy: action.data 
			}

		case SELECT_HSL:
			// let { hue, saturation, lightness } = action.data
			return {
				...state,
				// hue,
				// saturation,
				// lightness,
				...action.data
			}

		case RESET_VALUE_OF_HSL:
			return {
				...state,
				[action.data]: INITIAL_STATE[action.data]
			}

		default:
			return state		
	}
}
