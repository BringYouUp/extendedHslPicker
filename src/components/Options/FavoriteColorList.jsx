import React from "react";

import './FavoriteColorList.sass'

import { STARTED_COLLECTION } from '@consts/consts.js'

import { useSelector, useDispatch } from "react-redux"

import { getUrlAddress, createNotification } from '@utils/utils.js'

import { getFormattedHSL } from '@utils/utils.js'

import { selectHSL } from '@store/hslReducer/actions.js'

import { updateFirestore , getCollectionFromFireStore, getDataFromFireStore, unsub } from '@utils/firestoreUtils.js'

function FavoriteColorList ({ addNewNotification, currentUser, favoriteColorsList, setFavoriteColorsList}) {
	const dispatch = useDispatch()
	const hsl = useSelector(state => state.hsl)
	let favoriteListSub = null

	function initializeFavoriteColorList() {
		getCollectionFromFireStore(STARTED_COLLECTION, currentUser)
			.then(collection => getDataFromFireStore(collection, 'favoriteColorsList')
			.then(dataFromFireStore => {
				setFavoriteColorsList(dataFromFireStore)
			}))
			.catch(error => {
				addNewNotification(error.message, 'error')
			})
	}

	function selectFavoriteColor (selectedFavoriteColor) {
		let finalSelectedFavoriteColor = {
			hue: selectedFavoriteColor.hue,
			saturation: selectedFavoriteColor.saturation,
			lightness: selectedFavoriteColor.lightness,
			defaultFormatToCopy: hsl.defaultFormatToCopy
		}

		updateFirestore('hsl', finalSelectedFavoriteColor, STARTED_COLLECTION, currentUser)
		dispatch(selectHSL(finalSelectedFavoriteColor))
	}

	React.useEffect(() => {
		initializeFavoriteColorList()
	}, [currentUser])


	return (
		<div className={`favoriteCellList`}>
			{
				favoriteColorsList.map(favoriteColor => {
					return (
						<div
							key={favoriteColor.id}
							className='favoriteCell'
							style={{
								backgroundColor: getFormattedHSL(favoriteColor)
							}}
							onClick={() => selectFavoriteColor(favoriteColor)}
						/> 
					)
				})
			}
		</div>
	)
}

function isComponentNeedRerender (prevProps, nextProps) {
	let isShouldComponentUpdate = null

	if (prevProps.favoriteColorsList.length !== nextProps.favoriteColorsList.length)
		isShouldComponentUpdate = true

	if (prevProps.currentUser !== nextProps.currentUser)
		isShouldComponentUpdate = true

	return !isShouldComponentUpdate
}

export default React.memo(FavoriteColorList, isComponentNeedRerender)