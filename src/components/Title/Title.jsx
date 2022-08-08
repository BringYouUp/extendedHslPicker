import React from "react";

import { useDispatch, useSelector } from "react-redux"

import { getNewDefaultColorToCopy } from '@store/hslReducer/actions.js'

import { MAIN_FORMATS } from '@/consts.js'

const Title = () => {
	const dispatch = useDispatch()
	
	const hsl = useSelector(state => state.hsl)
	const copiedColorReducer = useSelector(state => state.copiedColorReducer)

	return (
		<div className='title'>
			{
				MAIN_FORMATS.map(format => {
					return (
						<h2
							key={format}
							style={
								{
									'filter': `opacity(${hsl.defaultFormatToCopy === format ? 1 : 0.25})`
								}
							}
							data-format-to-copy={format}
							onClick={e => { dispatch(getNewDefaultColorToCopy(e.target.dataset.formatToCopy)) }}>
							{copiedColorReducer[format]}
						</h2>
					)
				})
			}
		</div>
	)
}

export default Title