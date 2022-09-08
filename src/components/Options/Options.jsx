import React, { useState, useEffect } from "react";

import { Form } from '@components/index.js'

import { useDispatch, useSelector } from "react-redux"

import { toReadTextFromClipboard, updateUrlAdress, setDataIntoLocalStorage, isMobileDevice, getFormattedHSL, getUrlAddress, toWriteTextIntoClipboard, getRandomGeneratedNumber } from '@utils/utils.js'

import { selectHSL, getRandomColor } from '@store/hslReducer/actions.js'

import { copyClipboardTextToReducer, checkForTheSameUrlInClipboard, checkForTheSameTextInClipboard } from '@store/copiedColorReducer/actions.js'

import { STARTED_COLLECTION } from '@/consts.js'

import { IMG_USERED, IMG_LOGOUT, IMG_LOGIN, IMG_USER, IMG_COPIED_URL, IMG_MENU, IMG_COPY_URL, IMG_RANDOM, IMG_ADD, IMG_ADDED, IMG_LIST } from '@/resources.js'

import { getCollectionFromFireStore, getDataFromFireStore, updateFirestore, unsub } from '@utils/firestoreUtils.js'

import { app, db, auth } from '@/../firebase-config.js'

import { signOut } from "firebase/auth";

export default function Options ({ setNotifications, currentUser, setCurrentUser }) {
	const dispatch = useDispatch()
	
	const hsl = useSelector(state => state.hsl)
	const copiedColorReducer = useSelector(state => state.copiedColorReducer)

	const [ isUniqueColor, setIsUniqueColor ] = useState(true)
	const [ isOpenedList, setIsOpenedList ] = useState(true)
	const [ isMenuOpened, setIsMenuOpened ] = useState(true)
	const [ isAuthOpened, setIsAuthOpened ] = useState(false)

	const [ favoriteColorsList, setFavoriteColorsList ] = useState([])

	let favoriteListSub = null

	function isUnique () {
		let formattedNewColorHSLA = getFormattedHSL(hsl)
		let isNewColorUnique = favoriteColorsList.every(item => getFormattedHSL(item) !== formattedNewColorHSLA)

		return isNewColorUnique
	}

	function toAddToFavorite () {
		if (!isUnique()) return

		let { hue, saturation, lightness } = hsl
		let newFavoriteList = [ { hue, saturation, lightness, id: Date.now() }, ...favoriteColorsList]

		updateFirestore('favoriteColorsList', newFavoriteList, STARTED_COLLECTION, currentUser)
		setDataIntoLocalStorage('favoriteColorsList', newFavoriteList)

	}

	function toRemoveFromFavorite () {
		let newFavoriteList = favoriteColorsList.filter(item => item.hue !== hsl.hue)
		updateFirestore('favoriteColorsList', newFavoriteList, STARTED_COLLECTION, currentUser)
	}

	function toCopyUrlIntoClipboard () {
		// let urlAddress = getUrlAddress()

		// toWriteTextIntoClipboard(urlAddress)
		// dispatch(copyClipboardTextToReducer(urlAddress))

		setNotifications(prev => [prev, 1])
	}

	function updateFavoriteColorsListViaFirestore (actualDataFromFirestore) {
		setFavoriteColorsList(prev => actualDataFromFirestore?.favoriteColorsList || prev)
	}

	function getRandomColor () {
		let newHSL = {
			hue: getRandomGeneratedNumber(0, 361),
			saturation: getRandomGeneratedNumber(25, 100),
			lightness: getRandomGeneratedNumber(20, 100),
		}

		updateUrlAdress(newHSL)
		dispatch(selectHSL(newHSL))
		updateFirestore('hsl', newHSL, STARTED_COLLECTION, currentUser)
	}

	useEffect(() => {
		let urlAddress = getUrlAddress()

		toReadTextFromClipboard()
			.then(data => {
				dispatch(checkForTheSameTextInClipboard(data, copiedColorReducer[hsl.defaultFormatToCopy]))
				dispatch(checkForTheSameUrlInClipboard(data, urlAddress))
			})
	}, [copiedColorReducer.textFromClipboard, copiedColorReducer.hsl])

	useEffect(() => {
		favoriteListSub = unsub(updateFavoriteColorsListViaFirestore, STARTED_COLLECTION, currentUser)
	}, [currentUser])

	useEffect(() => {
		let urlAddress = getUrlAddress()
		
		dispatch(checkForTheSameUrlInClipboard(copiedColorReducer.textFromClipboard, urlAddress))
	}, [ copiedColorReducer.hsl, copiedColorReducer.textFromClipboard, hsl.defaultFormatToCopy])

	useEffect(() => {
		setIsUniqueColor(isUnique())
	}, [hsl, favoriteColorsList])

	useEffect(() => {
		setIsUniqueColor(isUnique())
	}, [hsl, favoriteColorsList])

	useEffect(() => {
		getCollectionFromFireStore(STARTED_COLLECTION, currentUser)
			.then(collection => getDataFromFireStore(collection, 'favoriteColorsList')
			.then(dataFromFireStore => {
				setFavoriteColorsList(dataFromFireStore)
				favoriteListSub = unsub(updateFavoriteColorsListViaFirestore, STARTED_COLLECTION, currentUser)
			}))

		return () => {
			typeof favoriteListSub === "function" && favoriteListSub()
		}
	}, [])

	function signOutFromProfile () {
		signOut(auth)
			.then(() => {
				localStorage.setItem('currentUser', Date.now())
				setCurrentUser(localStorage.getItem('currentUser'))
			})
			.catch((error) => { });
	}


	// console.log(auth)

	return (
		<div className={`footer`}>
			{
				!isMobileDevice() &&
				<img
					src={IMG_MENU}
					onClick={() => { setIsMenuOpened(prev => !prev) }}
					alt="Menu" 
					style={{
						'transform': `${isMenuOpened ? 'rotate(90deg)' : 'rotate(0deg)'}`
					}}/>
			}

			{
				isMenuOpened &&
				<>
					<img
						src={ auth.currentUser
							? IMG_LOGOUT
							: isAuthOpened ? IMG_USERED : IMG_USER }
						alt="Auth"
						onClick={() => { !auth.currentUser?.uid
							? setIsAuthOpened(prev => !prev)
							: signOutFromProfile() }}
						title="Auth" />


					<img
						src={ copiedColorReducer.isTheSameUrlInClipboard ? IMG_COPIED_URL : IMG_COPY_URL }
						onClick={(() => { toCopyUrlIntoClipboard() })}
						alt="Copy URL"
						title="Copy URL" />

					<img
						onClick={() => getRandomColor()}
						data-name="random"
						src={IMG_RANDOM}
						alt="Get random Color"
						title="Get random Color" />

					<img
						onClick={() => {isUniqueColor ? toAddToFavorite() : toRemoveFromFavorite()}}
						src={isUniqueColor ? IMG_ADD : IMG_ADDED}
						alt="Add to Favorite"
						title="Add to Favorite" />
				</>
			}

			<img
				onClick={() => { setIsOpenedList(prev => !prev)}}
				src={ IMG_LIST }
				alt="Show / Hide Favorite List"			
				title="title / Hide Favorite List"
				style={{
					'transform': `${isOpenedList
						? 'rotate(0deg)'
						: 'rotate(-90deg)'}`					
				}} />
			
			{ isOpenedList &&
				<div className={`favoriteCellList`}>
					{
						favoriteColorsList.map(item => {
							return (
								<div
									key={item.id}
									className="favoriteCell"
									style={{
										backgroundColor: getFormattedHSL(item)
									}}
									onClick={() => dispatch(selectHSL(item))} /> 
							)
						})
					}
				</div>
			}

			{
				isAuthOpened && <Form
					currentUser={currentUser}
					setCurrentUser={setCurrentUser}
					setIsAuthOpened={setIsAuthOpened}
				/>
			}
		</div>
	)
}