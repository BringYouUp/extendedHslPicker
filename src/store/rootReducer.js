import { combineReducers } from "redux";

import { hslReducer } from './hslReducer/hslReducer'
import { copiedColorReducer } from './copiedColorReducer/copiedColorReducer.js'

export const rootReducer = combineReducers({
	hslReducer, copiedColorReducer
})