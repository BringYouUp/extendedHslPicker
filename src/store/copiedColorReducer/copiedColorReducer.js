import { REFORMAT_FORMATS, UPDATE_CLIPBOARD} from './types.js'

import { COPIED_COLOR_HISTORY } from '@/consts.js'

import { getRandomGeneratedNumber } from '@utils/utils.js'

export const copiedColorReducer = (state = COPIED_COLOR_HISTORY, action) => {

	switch (action.type) {
		case REFORMAT_FORMATS:
			return {
				...state,
				hsl: action.payload.hsl,
				rgb: action.payload.rgb,
				hex: action.payload.hex,
			}
		case UPDATE_CLIPBOARD:
			return {
				...state,
				clipboard: action.payload
			}

		default:
			return state		
	}
}
