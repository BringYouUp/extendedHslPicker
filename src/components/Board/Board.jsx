import React, { useState, useEffect, useLayoutEffect } from "react";

import { useDispatch, useSelector } from "react-redux"

import { copyClipboardTextToReducer, checkForTheSameTextInClipboard, checkForTheSameUrlInClipboard } from '@store/copiedColorReducer/actions.js'

import { toCopyColorToClipboard, getUrlAddress } from '@utils/utils.js'

export default function Board () {
	const dispatch = useDispatch()
	
	const hsl = useSelector(state => state.hsl)
	const copiedColorReducer = useSelector(state => state.copiedColorReducer)
	
	function updateClipboard () {
		dispatch(copyClipboardTextToReducer(copiedColorReducer[hsl.defaultFormatToCopy]))
		toCopyColorToClipboard(copiedColorReducer[hsl.defaultFormatToCopy])
	}

	useEffect(() => {
		dispatch(checkForTheSameTextInClipboard(copiedColorReducer.textFromClipboard, copiedColorReducer[hsl.defaultFormatToCopy]))	
	}, [ copiedColorReducer.hsl, copiedColorReducer.textFromClipboard, hsl.defaultFormatToCopy])

	return (
		<div
			className="board"
			style={{backgroundColor: copiedColorReducer.hsl}}
			onClick={() => { updateClipboard()}}
		>
			<span> {copiedColorReducer.isTheSameTextInClipboard ? 'Copied' : 'Copy'} </span>
		</div>
	)
}
