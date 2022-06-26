import { INITIAL_STATE, INITIAL_HUE, INITIAL_SATURATION, INITIAL_LIGHTNESS, INITIAL_ALPHA } from './../../consts.js'
import { SELECT_HUE, SELECT_SATURATION, SELECT_LIGHTNESS, SELECT_ALPHA, RESET_HUE, RESET_SATURATION, RESET_LIGHTNESS, RESET_ALPHA, GET_RANDOM_COLOR } from './types.js'

import { getRandomGeneratedNumber } from './../../services/services.js'

export const hslReducer = (state = INITIAL_STATE, action) => {

	switch (action.type) {
		case SELECT_HUE:
			return {
				...state,
				hue: action.data,
			}

		case SELECT_SATURATION:
			return {
				...state,
				saturation: action.data,
			}

		case SELECT_LIGHTNESS:
			return {
				...state,
				lightness: action.data,
			}

		case SELECT_ALPHA:
			return {
				...state,
				alpha: action.data,
			}

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
				hue: getRandomGeneratedNumber(361),
				saturation: getRandomGeneratedNumber(100, 25),
				lightness: getRandomGeneratedNumber(75, 25),
				alpha: getRandomGeneratedNumber(100, 80) / 100,
			}

		default:
			return state		
	}
}
