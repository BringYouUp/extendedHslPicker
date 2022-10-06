import React from "react";

import './Main.sass'

import { useSelector, useDispatch } from "react-redux"

import { Slider, Board, Skeleton } from '@components/index.js'

import { isTwoObjectTheSame, isAddressBarIncludeQuery, setDataIntoLocalStorage } from '@utils/utils.js'

import { updateFirestore, unsub, getCollectionFromFireStore, getDataFromFireStore } from '@utils/firestoreUtils.js'

import { STARTED_COLLECTION, STARTED_HSL_REDUCER} from '@consts/consts.js'

import { selectHSL, getNewDefaultColorToCopy } from '@store/hslReducer/actions.js'

function Main ({ updateLoadingState , isLoading, updateClipboard, addNewNotification, currentUser }) {
	const hsl = useSelector(state => state.hsl)
	const dispatch = useDispatch()

	function getColorFromSharedURL () {
		dispatch(selectHSL(STARTED_HSL_REDUCER))
		updateFirestore('hsl', STARTED_HSL_REDUCER, STARTED_COLLECTION, currentUser)
	}

	function initializeStateWithFirestore () {
		getCollectionFromFireStore(STARTED_COLLECTION, currentUser)
			.then(collection => getDataFromFireStore(collection, 'hsl'))
			.then(dataFromFireStore => {
				dispatch(selectHSL({ ...dataFromFireStore }))
				dispatch(getNewDefaultColorToCopy(dataFromFireStore.defaultFormatToCopy))
			})
			.catch(error => {
				addNewNotification(error.message, 'error')
			})
			.finally(() => {
				updateLoadingState(false)
			})
		}

	React.useEffect(() => {
		setDataIntoLocalStorage('currentUser', currentUser)
		initializeStateWithFirestore()
	}, [currentUser])

	React.useEffect(() => {
		getCollectionFromFireStore(STARTED_COLLECTION, currentUser)
			.then(collection => getDataFromFireStore(collection, 'hsl'))
			.then(dataFromFireStore => {
				if (isAddressBarIncludeQuery() )
					if (!isTwoObjectTheSame(dataFromFireStore, STARTED_HSL_REDUCER))
						addNewNotification('Get data from shared URL', 'action', getColorFromSharedURL)
			})
		}, [])

	React.useEffect(() => {

	}, [hsl.lightness])

	const slidersConfig = [
		{
			relatedValue: 'hue',
			max: 360,
		},
		{
			relatedValue: 'saturation',
			max: 100,
		},
		{
			relatedValue: 'lightness',
			max: 100,
		},
	]

	return (
		<main>
			<Board
				updateClipboard={updateClipboard}
				isLoading={isLoading}
				addNewNotification={addNewNotification}
			/>
			{
				isLoading
				?  <Skeleton count={slidersConfig.length} />
				: slidersConfig.map(({ relatedValue, max}) => {
					return (
						<Slider
							currentUser={currentUser}
							key={relatedValue}
							relatedValue={relatedValue}
							max={max}
						/>
					)
				})		
			}
		</main>
	)
}

export default Main