import React from "react"

import "./Options.sass"

import { Form, FavoriteColorList, Spinner, Skeleton } from "@components/index.js"

import { useDispatch, useSelector } from "react-redux"

import { isTextTheSame, toReadTextFromClipboard, setDataIntoLocalStorage, isMobileDevice, getFormattedHSL, getUrlAddress, toWriteTextIntoClipboard } from "@utils/utils.js"

import { selectHSL, getNewDefaultColorToCopy } from "@store/hslReducer/actions.js"

import { INITIAL_HSL_REDUCER, STARTED_COLLECTION } from "@consts/consts.js"
import { IMG_USERED, IMG_LOGOUT, IMG_USER, IMG_COPIED_URL, IMG_MENU, IMG_COPY_URL, IMG_RANDOM, IMG_ADD, IMG_ADDED, IMG_LIST } from "@consts/resources.js"

import { updateFirestore } from "@utils/firestoreUtils.js"

import { auth } from "@/../firebase-config.js"

import { signOut } from "firebase/auth";

function Options ({ getRandomColor, checkForTheSameTextIn, isLoading, updateLoadingState, addNewNotification, currentUser, setCurrentUser }) {
	const dispatch = useDispatch()

	const hsl = useSelector(state => state.hsl)
	const copiedColorReducer = useSelector(state => state.copiedColorReducer)

	const [ isUniqueColor, setIsUniqueColor ] = React.useState(false)
	const [ isMenuOpened, setIsMenuOpened ] = React.useState(true)
	const [ isOpenedList, setIsOpenedList ] = React.useState(true)
	const [ isAuthOpened, setIsAuthOpened ] = React.useState(false)
	const [ isSpinnerLoading, setIsSpinnerLoading ] = React.useState(false)
	const [ favoriteColorsList, setFavoriteColorsList ] = React.useState([])

	function isUnique () {
		let formattedNewColorHSL = getFormattedHSL(hsl)
		let isNewColorUnique = favoriteColorsList.every(item => getFormattedHSL(item) !== formattedNewColorHSL)

		return isNewColorUnique
	}

	function toAddToFavorite () {
		if (!isUnique()) return

		let { hue, saturation, lightness } = hsl
		let newFavoriteList = [{ hue, saturation, lightness, id: Date.now() }, ...favoriteColorsList, ]

		setFavoriteColorsList(newFavoriteList)
		updateFirestore("favoriteColorsList", newFavoriteList, STARTED_COLLECTION, currentUser)
	}

	function toRemoveFromFavorite () {
		let newFavoriteList = favoriteColorsList.filter(item => item.hue !== hsl.hue)
		setFavoriteColorsList(newFavoriteList)
		updateFirestore("favoriteColorsList", newFavoriteList, STARTED_COLLECTION, currentUser)
	}

	function updateClipboard (textToCopy) {
		toReadTextFromClipboard()
			.then(textFromClipboard => {
				if (isTextTheSame(textFromClipboard, textToCopy)) {
					throw new Error("text is already in clipboard")
				} else {
					addNewNotification(`URL adress copied successfully`)
					toWriteTextIntoClipboard(textToCopy)
					checkForTheSameTextIn()
				}
			})
			.catch(error => {
				addNewNotification(error.message, "error")
			})
	}

	React.useEffect(() => {
		setIsUniqueColor(isUnique())
	}, [hsl, favoriteColorsList])

	React.useEffect(() => {
		setDataIntoLocalStorage("favoriteColorsList", favoriteColorsList)
	}, [favoriteColorsList])

	function signOutFromProfile () {
		setIsSpinnerLoading(true)
		
		signOut(auth)
			.then(() => {
				localStorage.setItem("currentUser", Date.now())
				setCurrentUser(localStorage.getItem("currentUser"))
				addNewNotification("successfully logged out")
				dispatch(selectHSL({...INITIAL_HSL_REDUCER}))
				dispatch(getNewDefaultColorToCopy(INITIAL_HSL_REDUCER.defaultFormatToCopy))
				updateLoadingState(true)
			})
			.catch((error) => {
				addNewNotification(error.name, "error")
			})
			.finally(() => {
				setIsSpinnerLoading(false)
			})
	}

	return (
		<footer>
			{
				isLoading
				? <Skeleton count={6} />
				: <>
					{ !isMobileDevice() &&
						<img
							src={IMG_MENU}
							onClick={() => { setIsMenuOpened(prev => !prev) }}
							alt="Menu" 
							style={{ "transform": `${isMenuOpened ? "rotate(90deg)" : "rotate(0deg)"}` }} />
					}

					{ isMenuOpened &&
						<>
							{ !isSpinnerLoading
								? <img
									src={ auth.currentUser
										? IMG_LOGOUT
										: isAuthOpened ? IMG_USERED : IMG_USER }
									alt="Auth"
									onClick={() => { !auth.currentUser?.uid
										? setIsAuthOpened(prev => !prev)
										: signOutFromProfile() }}
									title="Sign Out" />
								: <Spinner />
							}
							<img
								src={ copiedColorReducer.isTheSameUrlInClipboard ? IMG_COPIED_URL : IMG_COPY_URL }
								onClick={(() => { updateClipboard(getUrlAddress()) })}
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
							"transform": `${isOpenedList
								? "rotate(0deg)"
								: "rotate(-90deg)"}`					
						}} />
					
					{
						isOpenedList && <FavoriteColorList
							addNewNotification={addNewNotification}
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
		</footer>
	)
}

function isComponentNeedRerender (prevProps, nextProps) {
	let isShouldComponentUpdate = null
	if (prevProps.currentUser === nextProps.currentUser)
		isShouldComponentUpdate = false
	if (prevProps.isLoading !== nextProps.isLoading)
		isShouldComponentUpdate = true

	return !isShouldComponentUpdate
}

export default React.memo(Options, isComponentNeedRerender)