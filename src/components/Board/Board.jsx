import React, { useState, useEffect, useLayoutEffect } from "react";

import { useDispatch, useSelector } from "react-redux"

import { getNewDefaultColorToCopy } from '@store/hslReducer/actions.js'

import { updateClipboard } from '@store/copiedColorReducer/actions.js'

import { getFormatted, toCopyColorInClipboard, getFormattedHSL, isTextTheSame } from '@utils/utils.js'

import { MAIN_FORMATS } from '@/consts.js'

const Board = () => {
	
	const hsl = useSelector(state => state.hsl)
	const dispatch = useDispatch()
	const copiedColorReducer = useSelector(state => state.copiedColorReducer)

	const [ isTheSame, setTheSame ] = useState(false)
	const [ textFromClipBoard, setTextFromClipboard ] = useState(null)
	
	const toUpdateDefaultFormat = e => {
		e.stopPropagation()
		dispatch(getNewDefaultColorToCopy(e.target.dataset.formatToCopy))
	}

	const updateClipboard = () => {
		setTextFromClipboard(copiedColorReducer[hsl.defaultFormatToCopy])
		toCopyColorInClipboard(copiedColorReducer[hsl.defaultFormatToCopy])
	}

	useEffect(() => {
		let isTheSameTextInClipboard = isTextTheSame(textFromClipBoard, copiedColorReducer, hsl.defaultFormatToCopy)
		setTheSame(isTheSameTextInClipboard)
	}, [ textFromClipBoard, copiedColorReducer, hsl.defaultFormatToCopy])

	return (
		<div
			className="board"
			style={{backgroundColor: copiedColorReducer.hsl}}
			onClick={() => { updateClipboard()}}
		>	
			{
				MAIN_FORMATS.map(format => {
					return (
						<h2
							key={format}
							style={{'filter': `opacity(${hsl.defaultFormatToCopy === format ? 1 : 0.25})`}}
							data-format-to-copy={format}
							onClick={e => { toUpdateDefaultFormat(e) }}>
							{copiedColorReducer[format]}
						</h2>
					)
				})
			}

			<div className="board-status">
				{isTheSame ? 'Copied' : 'Copy'}
			</div>
		</div>
	)
}

export default Board