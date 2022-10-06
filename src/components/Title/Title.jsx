import React from "react";

import './Title.sass'

import { useDispatch, useSelector } from "react-redux"

import { getNewDefaultColorToCopy } from '@store/hslReducer/actions.js'

import { MAIN_FORMATS, STARTED_COLLECTION } from '@consts/consts.js'

import { updateFirestore } from '@utils/firestoreUtils.js'

import { Skeleton } from '@components/index.js'

const Title = ({ currentUser, isLoading }) => {
	const dispatch = useDispatch()
	const hsl = useSelector(state => state.hsl)
	const copiedColorReducer = useSelector(state => state.copiedColorReducer)

	function updateDefaultFormatToCopy(e) {
		let generatedHSL = { ...hsl, defaultFormatToCopy: e.target.dataset.formatToCopy }
		dispatch(getNewDefaultColorToCopy(e.target.dataset.formatToCopy))
		updateFirestore('hsl', generatedHSL, STARTED_COLLECTION, currentUser)
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

	return (
		<header>
			{
				isLoading
					? <Skeleton count={3} />
					: renderTitles
			}
		</header>
	)
}

export default Title