import { combineReducers } from "redux";

import { hsl } from './hslReducer/hslReducer'
import { copiedColorReducer } from './copiedColorReducer/copiedColorReducer.js'

export const rootReducer = combineReducers({
	hsl, copiedColorReducer
})