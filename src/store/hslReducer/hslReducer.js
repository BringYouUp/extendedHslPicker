import { STARTED_HSL_REDUCER, INITIAL_HSL_REDUCER} from '@consts/consts.js'

import { SELECT_HSL, STARTED_HSL, RESET_VALUE_OF_HSL, REFORMAT_FORMATS, GET_NEW_DEFAULT_FORMAT } from './types.js'

import { getRandomGeneratedNumber } from '@utils/utils.js'

export const hsl = (state = STARTED_HSL_REDUCER, action) => {
	// console.log(action.type)
	switch (action.type) {
		case SELECT_HSL:
			return {
				...state,
				...action.payload
			}

		case STARTED_HSL:
			return {
				...state,
				...action.payload
			}

		case RESET_VALUE_OF_HSL:
			return {
				...state,
				[action.payload]: INITIAL_HSL_REDUCER[action.payload]
			}

		case GET_NEW_DEFAULT_FORMAT:
			return {
				...state,
				defaultFormatToCopy: action.payload 
			}

		default:
			return state		
	}
}
