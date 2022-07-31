import { REFORMAT_FORMATS, UPDATE_CLIPBOARD } from './types.js'

import { getFormatted } from '@utils/utils.js'

function reformatFormats (actualHSL) {
	return {
		type: REFORMAT_FORMATS,
		payload: getFormatted(actualHSL)
	}
}

function updateClipboard (textInClipboard) {
	return {
		type: UPADTE_CLIPBOARD,
		payload: textInClipboard
	}
}


export { reformatFormats, updateClipboard}