import { REFORMAT_FORMATS } from './types.js'

import { getFormatted } from './../../services/services.js'

function reformatFormats (actualHSLA) {
	return {
		type: REFORMAT_FORMATS,
		data: getFormatted(actualHSLA)
	}
}


export { reformatFormats }