import { INITIAL_STATE, INITIAL_HUE, INITIAL_SATURATION, INITIAL_LIGHTNESS, INITIAL_ALPHA } from './../../consts.js'

import { SELECT_HSLA, RESET_HUE, RESET_SATURATION, RESET_LIGHTNESS, RESET_ALPHA, GET_RANDOM_COLOR, REFORMAT_FORMATS, GET_NEW_DEFAULT_FORMAT } from './types.js'

import { getRandomGeneratedNumber } from './../../services/services.js'

export const hslReducer = (state = INITIAL_STATE, action) => {

	switch (action.type) {

		case RESET_HUE:
			return {
				...state,
				hue: INITIAL_HUE,
			} 
		case RESET_SATURATION:
			return {
				...state,
				saturation: INITIAL_SATURATION,
			}  
		case RESET_LIGHTNESS:
			return {
				...state,
				lightness: INITIAL_LIGHTNESS,
			}  
		case RESET_ALPHA:
			return {
				...state,
				alpha: INITIAL_ALPHA,
			}

		case GET_RANDOM_COLOR:
			return {
				...state,
				hue: getRandomGeneratedNumber(361),
				saturation: getRandomGeneratedNumber(100, 25),
				lightness: getRandomGeneratedNumber(75, 25),
				alpha: getRandomGeneratedNumber(100, 80) / 100,
			}

		case GET_NEW_DEFAULT_FORMAT:
			return {
				...state,
				defaultFormatToCopy: action.data 
			}

		case SELECT_HSLA:
			let { hue, saturation, lightness, alpha } = action.data
			return {
				...state,
				hue,
				saturation,
				lightness,
				alpha,
			}

		default:
			return state		
	}
}
