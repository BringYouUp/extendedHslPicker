import { REFORMAT_FORMATS } from './types.js'

import { COPIED_COLOR_HISTORY } from './../../consts.js'

import { getRandomGeneratedNumber } from './../../services/services.js'

export const copiedColorReducer = (state = COPIED_COLOR_HISTORY, action) => {

	switch (action.type) {


		case REFORMAT_FORMATS:
			return {
				...state,
				hsla: action.data.hsla,
				rgba: action.data.rgba,
				hexa: action.data.hexa,
			}

		default:
			return state		
	}
}
