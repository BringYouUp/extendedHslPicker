import React, { useState, useEffect } from "react";

import { Form, FavoriteColorList, Spinner} from '@components/index.js'

import { useDispatch, useSelector } from "react-redux"

import { getRandomGeneratedHSL, createNotification, toReadTextFromClipboard, updateUrlAdress, setDataIntoLocalStorage, isMobileDevice, getFormattedHSL, getUrlAddress, toWriteTextIntoClipboard, getRandomGeneratedNumber } from '@utils/utils.js'

import { selectHSL, getRandomColor } from '@store/hslReducer/actions.js'

import { copyClipboardTextToReducer, checkForTheSameUrlInClipboard, checkForTheSameTextInClipboard } from '@store/copiedColorReducer/actions.js'

import { STARTED_COLLECTION } from '@/consts.js'

import { IMG_USERED, IMG_LOGOUT, IMG_LOGIN, IMG_USER, IMG_COPIED_URL, IMG_MENU, IMG_COPY_URL, IMG_RANDOM, IMG_ADD, IMG_ADDED, IMG_LIST } from '@/resources.js'

import { getCollectionFromFireStore, getDataFromFireStore, updateFirestore, unsub } from '@utils/firestoreUtils.js'

import { app, db, auth } from '@/../firebase-config.js'

import { signOut } from "firebase/auth";

function Options ({ addNewNotification, currentUser, setCurrentUser }) {
	const dispatch = useDispatch()
	
	const hsl = useSelector(state => state.hsl)
	const copiedColorReducer = useSelector(state => state.copiedColorReducer)

	const [ isUniqueColor, setIsUniqueColor ] = useState(false)
	const [ isOpenedList, setIsOpenedList ] = useState(true)
	const [ isMenuOpened, setIsMenuOpened ] = useState(true)
	const [ isAuthOpened, setIsAuthOpened ] = useState(false)
	const [ isLoading, setIsLoading ] = useState(false)
	const [ favoriteColorsList, setFavoriteColorsList ] = useState([])

	function isUnique () {
		let formattedNewColorHSL = getFormattedHSL(hsl)
		let isNewColorUnique = favoriteColorsList.every(item => getFormattedHSL(item) !== formattedNewColorHSL)

		return isNewColorUnique
	}

	function toAddToFavorite () {
		if (!isUnique()) return

		let { hue, saturation, lightness } = hsl
		let newFavoriteList = [...favoriteColorsList, { hue, saturation, lightness, id: Date.now() }]

		updateFirestore('favoriteColorsList', newFavoriteList, STARTED_COLLECTION, currentUser)
		setDataIntoLocalStorage('favoriteColorsList', newFavoriteList)
	}

	function toRemoveFromFavorite () {
		let newFavoriteList = favoriteColorsList.filter(item => item.hue !== hsl.hue)
		updateFirestore('favoriteColorsList', newFavoriteList, STARTED_COLLECTION, currentUser)
	}

	function toCopyUrlIntoClipboard () {
		toReadTextFromClipboard()
			.then(data => {
				let urlAddress = getUrlAddress()
				if (data !==  urlAddress) {
					addNewNotification('url address successfully copied')
					dispatch(copyClipboardTextToReducer(urlAddress))
					toWriteTextIntoClipboard(urlAddress)
				}
				else
					addNewNotification('text is already in clipboard', 'error')

			})
			.catch(error => addNewNotification(error.message, 'error'))		
	}

	function getRandomColor () {
		let generatedHSL = getRandomGeneratedHSL()

		updateUrlAdress(generatedHSL)
		dispatch(selectHSL(generatedHSL))
		updateFirestore('hsl', generatedHSL, STARTED_COLLECTION, currentUser)
	}

	useEffect(() => {
		let urlAddress = getUrlAddress()

		toReadTextFromClipboard()
			.then(data => {
				dispatch(checkForTheSameTextInClipboard(data, copiedColorReducer[hsl.defaultFormatToCopy]))
				dispatch(checkForTheSameUrlInClipboard(data, urlAddress))
			})
	}, [copiedColorReducer.textFromClipboard, copiedColorReducer.hsl, hsl.defaultFormatToCopy])


	useEffect(() => {
		setIsUniqueColor(isUnique())
	}, [hsl, favoriteColorsList])


	function signOutFromProfile () {
		setIsLoading(true)
		signOut(auth)
			.then(() => {
				localStorage.setItem('currentUser', Date.now())
				setCurrentUser(localStorage.getItem('currentUser'))
				addNewNotification('successfully logged out')

			})
			.catch((error) => {
				addNewNotification(error.name, 'error')
			})
			.finally(() => {
				setIsLoading(false)
			})
	}

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
					{
						!isLoading
						? <img
							src={ auth.currentUser
								? IMG_LOGOUT
								: isAuthOpened ? IMG_USERED : IMG_USER }
							alt="Auth"
							onClick={() => { !auth.currentUser?.uid
								? setIsAuthOpened(prev => !prev)
								: signOutFromProfile() }}
							title="Auth" />
						: <Spinner />
					}
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
			
			{
				isOpenedList && <FavoriteColorList
					favoriteColorsList={favoriteColorsList}
					setFavoriteColorsList={setFavoriteColorsList}
					currentUser={currentUser}
				/>
			}

			{
				isAuthOpened && <Form
					currentUser={currentUser}
					setCurrentUser={setCurrentUser}
					setIsAuthOpened={setIsAuthOpened}
					addNewNotification={addNewNotification}
				/>
			}
		</div>
	)
}

function isComponentNeedRerender (prevProps, nextProps) {
	// console.log(nextProps)
	// console.log(prevProps)
	// console.log(prevProps.currentUser)
	// console.log(nextProps.currentUser)
	let isShouldComponentUpdate = null
	// debugger
	if (prevProps.currentUser == nextProps.currentUser)
		isShouldComponentUpdate = false
	else
		isShouldComponentUpdate = true

	return !isShouldComponentUpdate
}

export default React.memo(Options, isComponentNeedRerender)