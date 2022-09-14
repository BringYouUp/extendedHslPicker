import { REFORMAT_FORMATS, TEXT_FROM_CLIPBOARD, IS_THE_SAME_TEXT_IN_CLIPBOARD, IS_THE_SAME_URL_IN_CLIPBOARD } from './types.js'

import { getFormatted, isTextTheSame } from '@utils/utils.js'

export function reformatFormats (actualHSL) {
	return {
		type: REFORMAT_FORMATS,
		payload: getFormatted(actualHSL)
	}
}

export function copyClipboardTextToReducer (actualText) {
	// console.log(actualText)
	return {
		type: TEXT_FROM_CLIPBOARD,
		payload: actualText
	}
}

export function checkForTheSameTextInClipboard (clipboardText, anotherText) {
	return {
		type: IS_THE_SAME_TEXT_IN_CLIPBOARD,
		payload: isTextTheSame(clipboardText, anotherText)
	}
}

export function checkForTheSameUrlInClipboard (clipboardText, anotherText) {
	return {
		type: IS_THE_SAME_URL_IN_CLIPBOARD,
		payload: isTextTheSame(clipboardText, anotherText)
	}
}