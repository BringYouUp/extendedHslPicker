import React from "react";

import { useDispatch, useSelector } from "react-redux"

import { copyClipboardTextToReducer, checkForTheSameTextInClipboard, checkForTheSameUrlInClipboard } from '@store/copiedColorReducer/actions.js'

import { getUrlAddress, createNotification, updateBoardSpanColor, toWriteTextIntoClipboard, toReadTextFromClipboard } from '@utils/utils.js'

function Board ({ addNewNotification }) {
	const dispatch = useDispatch()

	const hsl = useSelector(state => state.hsl)
	const copiedColorReducer = useSelector(state => state.copiedColorReducer)

	const renderBoard = React.useMemo(() =>
		<div
			className="board"
			style={{
				backgroundColor: copiedColorReducer.hsl
			}}
			onClick={updateClipboard}>
			<span
				style={{
					color: updateBoardSpanColor(hsl)
				}}> 
					{copiedColorReducer.isTheSameTextInClipboard ? 'Copied' : 'Copy'}
			</span>
		</div>
	, [hsl.defaultFormatToCopy, copiedColorReducer])

	function updateClipboard () {
		toReadTextFromClipboard()
			.then(data => {
				if (data !== copiedColorReducer[hsl.defaultFormatToCopy]) {
					addNewNotification(`${hsl.defaultFormatToCopy} color copied successfully`)
					dispatch(copyClipboardTextToReducer(copiedColorReducer[hsl.defaultFormatToCopy]))
					toWriteTextIntoClipboard(copiedColorReducer[hsl.defaultFormatToCopy])	
				} else {
					addNewNotification('text is already in clipboard', 'error')
				}
			})
			.catch(error => addNewNotification(error.message, 'error'))

		toReadTextFromClipboard()
			.then(data => dispatch(checkForTheSameTextInClipboard(data, copiedColorReducer[hsl.defaultFormatToCopy])))
	}

	return renderBoard
}

export default React.memo(Board)