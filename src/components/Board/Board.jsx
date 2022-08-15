import React, { useState, useEffect, useLayoutEffect } from "react";

import { useDispatch, useSelector } from "react-redux"

import { copyClipboardTextToReducer, checkForTheSameTextInClipboard } from '@store/copiedColorReducer/actions.js'

import { addHoverEmulatedEffects, removeHoverEmulatedEffects, toWriteTextIntoClipboard, getUrlAddress } from '@utils/utils.js'

export default function Board () {
	const dispatch = useDispatch()
	
	const hsl = useSelector(state => state.hsl)
	const copiedColorReducer = useSelector(state => state.copiedColorReducer)
	
	function updateClipboard () {
		dispatch(copyClipboardTextToReducer(copiedColorReducer[hsl.defaultFormatToCopy]))
		toWriteTextIntoClipboard(copiedColorReducer[hsl.defaultFormatToCopy])
	}

	useEffect(() => {
		dispatch(checkForTheSameTextInClipboard(copiedColorReducer.textFromClipboard, copiedColorReducer[hsl.defaultFormatToCopy]))	
	}, [ copiedColorReducer.hsl, copiedColorReducer.textFromClipboard, hsl.defaultFormatToCopy])

	return (
		<div
			className="board"
			style={{
				backgroundColor: copiedColorReducer.hsl
			}}
			onClick={() => { updateClipboard() }}
		>
			<span> {copiedColorReducer.isTheSameTextInClipboard ? 'Copied' : 'Copy'} </span>
		</div>
	)
}
