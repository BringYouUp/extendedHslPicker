import { REFORMAT_FORMATS, IS_THE_SAME_TEXT_IN_CLIPBOARD, IS_THE_SAME_URL_IN_CLIPBOARD } from './types.js'

import { INITIAL_COPIED_COLOR_REDUCER } from '@consts/consts.js'

import { getRandomGeneratedNumber } from '@utils/utils.js'

export const copiedColorReducer = (state = INITIAL_COPIED_COLOR_REDUCER, action) => {
	switch (action.type) {
		case REFORMAT_FORMATS:
			return {
				...state,
				hsl: action.payload.hsl,
				rgb: action.payload.rgb,
				hex: action.payload.hex,
			}

		case IS_THE_SAME_TEXT_IN_CLIPBOARD:
			return {
				...state,
				isTheSameTextInClipboard: action.payload
			}

		case IS_THE_SAME_URL_IN_CLIPBOARD:
			return {
				...state,
				isTheSameUrlInClipboard: action.payload
			}

		default:
			return state		
	}
}
