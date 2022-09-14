import React from "react";

import { STARTED_COLLECTION } from '@/consts.js'

import { useDispatch } from "react-redux"

import { getUrlAddress, createNotification } from '@utils/utils.js'

import { getFormattedHSL } from '@utils/utils.js'

import { selectHSL } from '@store/hslReducer/actions.js'

import { getCollectionFromFireStore, getDataFromFireStore, unsub } from '@utils/firestoreUtils.js'

function FavoriteColorList ({ favoriteColorsList, currentUser, setFavoriteColorsList}) {
	const dispatch = useDispatch()
	let favoriteListSub = null

	function updateFavoriteColorsListViaFirestore (actualDataFromFirestore) {
		setFavoriteColorsList(prev => actualDataFromFirestore.favoriteColorsList || prev)
	}

	function initializeFavoriteColorList() {
		getCollectionFromFireStore(STARTED_COLLECTION, currentUser)
			.then(collection => getDataFromFireStore(collection, 'favoriteColorsList')
			.then(dataFromFireStore => {
				setFavoriteColorsList(dataFromFireStore)
				favoriteListSub = unsub(updateFavoriteColorsListViaFirestore, STARTED_COLLECTION, currentUser)
			}))
	}

	React.useEffect(() => {
		initializeFavoriteColorList()

		return () => { typeof favoriteListSub === "function" && favoriteListSub() }
	}, [currentUser])

	React.useEffect(() => {
		initializeFavoriteColorList()

		return () => { typeof favoriteListSub === "function" && favoriteListSub() }
	}, [])

	return (
		<div className={`favoriteCellList`}>
			{
				favoriteColorsList.map(favoriteColor => {
					return (
						<div
							key={favoriteColor.id}
							className="favoriteCell"
							style={{
								backgroundColor: getFormattedHSL(favoriteColor)
							}}
							onClick={() => dispatch(selectHSL(favoriteColor))}
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

export default FavoriteColorList