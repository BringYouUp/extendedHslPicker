import React from "react";

import { useDispatch, useSelector } from "react-redux"

import { copyClipboardTextToReducer, checkForTheSameTextInClipboard, checkForTheSameUrlInClipboard } from '@store/copiedColorReducer/actions.js'

import { updateBoardSpanColor, toWriteTextIntoClipboard, toReadTextFromClipboard } from '@utils/utils.js'

export default function Board () {
	const dispatch = useDispatch()

	const hsl = useSelector(state => state.hsl)
	const copiedColorReducer = useSelector(state => state.copiedColorReducer)

	function updateClipboard () {
		dispatch(copyClipboardTextToReducer(copiedColorReducer[hsl.defaultFormatToCopy]))
		toWriteTextIntoClipboard(copiedColorReducer[hsl.defaultFormatToCopy])
		toReadTextFromClipboard()
			.then(data => {
				dispatch(checkForTheSameTextInClipboard(data, copiedColorReducer[hsl.defaultFormatToCopy]))
			})
	}

	return (
		<div
			className="board"
			style={{
				backgroundColor: copiedColorReducer.hsl
			}}
			onClick={() => { updateClipboard() }}
		>
			<span
				style={{
					color: updateBoardSpanColor(hsl)
				}}
			> {copiedColorReducer.isTheSameTextInClipboard ? 'Copied' : 'Copy'} </span>
		</div>
	)
}