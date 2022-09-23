import React, { useState, useEffect } from "react";

import { Form, FavoriteColorList, Spinner} from '@components/index.js'

import { useDispatch, useSelector } from "react-redux"

import { getRandomGeneratedHSL, createNotification, toReadTextFromClipboard, setDataIntoLocalStorage, isMobileDevice, getFormattedHSL, getUrlAddress, toWriteTextIntoClipboard, getRandomGeneratedNumber } from '@utils/utils.js'

import { selectHSL, getRandomColor } from '@store/hslReducer/actions.js'

import { copyClipboardTextToReducer, checkForTheSameUrlInClipboard, checkForTheSameTextInClipboard } from '@store/copiedColorReducer/actions.js'

import { STARTED_COLLECTION } from '@consts/consts.js'

import { IMG_USERED, IMG_LOGOUT, IMG_LOGIN, IMG_USER, IMG_COPIED_URL, IMG_MENU, IMG_COPY_URL, IMG_RANDOM, IMG_ADD, IMG_ADDED, IMG_LIST } from '@consts/resources.js'

import { getCollectionFromFireStore, getDataFromFireStore, updateFirestore, unsub } from '@utils/firestoreUtils.js'

import { app, db, auth } from '@/../firebase-config.js'

import { signOut } from "firebase/auth";

function Options ({ isLoading, updateLoadingState, addNewNotification, currentUser, setCurrentUser }) {
	const dispatch = useDispatch()
	
	const hsl = useSelector(state => state.hsl)
	const copiedColorReducer = useSelector(state => state.copiedColorReducer)

	const [ isUniqueColor, setIsUniqueColor ] = useState(false)
	const [ isMenuOpened, setIsMenuOpened ] = useState(true)
	const [ isOpenedList, setIsOpenedList ] = useState(false)
	const [ isAuthOpened, setIsAuthOpened ] = useState(false)
	const [ isSpinnerLoading, setIsSpinnerLoading ] = useState(false)
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
		let generatedHSL = { ...getRandomGeneratedHSL(), defaultFormatToCopy: hsl.defaultFormatToCopy }

		updateFirestore('hsl', generatedHSL, STARTED_COLLECTION, currentUser)
	}

	useEffect(() => {
		let urlAddress = getUrlAddress()

		document.hasFocus() && toReadTextFromClipboard()
			.then(data => {
				dispatch(checkForTheSameTextInClipboard(data, copiedColorReducer[hsl.defaultFormatToCopy]))
				dispatch(checkForTheSameUrlInClipboard(data, urlAddress))
			})
	}, [copiedColorReducer.textFromClipboard, copiedColorReducer.hsl, hsl.defaultFormatToCopy])

	useEffect(() => {
		setIsUniqueColor(isUnique())
	}, [hsl, favoriteColorsList])

	useEffect(() => {
		setDataIntoLocalStorage('favoriteColorsList', favoriteColorsList)
	}, [favoriteColorsList])


	function signOutFromProfile () {
		setIsSpinnerLoading(true)
		
		signOut(auth)
			.then(() => {
				localStorage.setItem('currentUser', Date.now())
				setCurrentUser(localStorage.getItem('currentUser'))
				addNewNotification('successfully logged out')
				updateLoadingState(true)
			})
			.catch((error) => {
				addNewNotification(error.name, 'error')
			})
			.finally(() => {
				setIsSpinnerLoading(false)
			})
	}

	return (
		<div className={`footer`}>
			{
				isLoading
				?  <>
						<div className="skeleton" />
						<div className="skeleton" />
						<div className="skeleton" />
						<div className="skeleton" />
						<div className="skeleton" />
						<div className="skeleton" />
					</>
				: <>
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
								!isSpinnerLoading
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


				</>
			}
			{
				isAuthOpened && <Form
					currentUser={currentUser}
					updateLoadingState={updateLoadingState}
					setCurrentUser={setCurrentUser}
					setIsAuthOpened={setIsAuthOpened}
					addNewNotification={addNewNotification}
					setFavoriteColorsList={setFavoriteColorsList}
				/>
			}
		</div>
	)
}

function isComponentNeedRerender (prevProps, nextProps) {
	let isShouldComponentUpdate = true
	if (prevProps.currentUser === nextProps.currentUser)
		isShouldComponentUpdate = false
	if (prevProps.isLoading !== nextProps.isLoading)
		isShouldComponentUpdate = true

	return !isShouldComponentUpdate
}

export default React.memo(Options, isComponentNeedRerender)