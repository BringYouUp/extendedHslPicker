import React from "react";

import { useDispatch, useSelector } from "react-redux"

import { getNewDefaultColorToCopy } from '@store/hslReducer/actions.js'

import { MAIN_FORMATS } from '@consts/consts.js'

const Title = ({ isLoading }) => {
	const dispatch = useDispatch()
	
	const hsl = useSelector(state => state.hsl)
	const copiedColorReducer = useSelector(state => state.copiedColorReducer)

	function updateDefaultFormatToCopy(e) {
		dispatch(getNewDefaultColorToCopy(e.target.dataset.formatToCopy))
	}

	const renderTitles = React.useMemo(() =>
		MAIN_FORMATS.map(format =>
			<h2
				key={format}
				style={ {
					'filter': `opacity(${hsl.defaultFormatToCopy === format ? 1 : 0.25})`
				}}
				data-format-to-copy={format}
				onClick={e => { updateDefaultFormatToCopy(e) }}>
				{copiedColorReducer[format]}
			</h2>)
	, [hsl.defaultFormatToCopy, copiedColorReducer.hsl])

	const renderSkeletonTitles = () => <>
				<div className="skeleton"> </div>
				<div className="skeleton"> </div>
				<div className="skeleton"> </div>
			</>


	return (
		<div className='title'>
			{	isLoading
				? renderSkeletonTitles()
				: renderTitles }
		</div>
	)
}

export default Title