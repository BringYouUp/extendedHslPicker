import { REFORMAT_FORMATS } from './types.js'

import { getFormatted } from '@utils/utils.js'

function reformatFormats (actualHSL) {
	return {
		type: REFORMAT_FORMATS,
		data: getFormatted(actualHSL)
	}
}


export { reformatFormats }