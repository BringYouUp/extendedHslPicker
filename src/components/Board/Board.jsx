import React from "react"

import { useSelector } from "react-redux"

import { updateBoardSpanColor } from "@utils/utils.js"

import { Skeleton } from "@components/index.js"

export default function Board ({ updateClipboard, isLoading, addNewNotification }) {
	const hsl = useSelector(state => state.hsl)
	const copiedColorReducer = useSelector(state => state.copiedColorReducer)

	return isLoading
		? <Skeleton />
		: <div
				className="board"
				style={{ backgroundColor: copiedColorReducer.hsl }}
				onClick={() => { updateClipboard(copiedColorReducer[hsl.defaultFormatToCopy])}}>
				<span style={{ color: updateBoardSpanColor(hsl) }}> 
					{copiedColorReducer.isTheSameTextInClipboard ? "Copied" : "Copy"}
				</span>
			</div>
}
