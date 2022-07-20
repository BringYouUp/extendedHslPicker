import { REFORMAT_FORMATS } from './types.js'

import { COPIED_COLOR_HISTORY } from '@/consts.js'

import { getRandomGeneratedNumber } from '@utils/utils.js'

export const copiedColorReducer = (state = COPIED_COLOR_HISTORY, action) => {

	switch (action.type) {
		case REFORMAT_FORMATS:
			return {
				...state,
				hsl: action.data.hsl,
				rgb: action.data.rgb,
				hex: action.data.hex,
			}

		default:
			return state		
	}
}
