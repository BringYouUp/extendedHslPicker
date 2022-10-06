import React from "react";

import styles from '@styles/root.sass'

import { Main, Title, Options, Notifications, NotFound } from '@components/index.js'

import { useDispatch, useSelector } from "react-redux"

import { selectHSL } from '@store/hslReducer/actions.js'

import { reformatFormats, checkForTheSameUrlInClipboard, checkForTheSameTextInClipboard } from '@store/copiedColorReducer/actions.js'

import { STARTED_COLLECTION } from '@consts/consts.js'

import { getInitialUser, isTextTheSame, getRandomGeneratedHSL, updateUrlAdress, createNotification, setDataIntoLocalStorage, toReadTextFromClipboard, getUrlAddress, toWriteTextIntoClipboard } from '@utils/utils.js'

import { updateFirestore } from '@utils/firestoreUtils.js'

import { onAuthStateChanged  } from "firebase/auth";

import { auth } from './../firebase-config.js'

const App = () => {
	const hsl = useSelector(state => state.hsl)
	const dispatch = useDispatch()
	const copiedColorReducer = useSelector(state => state.copiedColorReducer)

	const [ currentUser, setCurrentUser ] = React.useState(getInitialUser()) 
	const [ notifications, setNotifications ] = React.useState([])
	const [ isLoading, updateLoadingState ] = React.useState(true)
	const [ isAppOnline, updateAppOnlineStatus ] = React.useState(true)

	function addNewNotification(...args) {
		let newNotification = createNotification(...args)
		setNotifications(prev => [newNotification, ...prev ])
	}

	function checkForTheSameTextIn() {
		let urlAddress = getUrlAddress()
		
		document.hasFocus() && toReadTextFromClipboard()
			.then(textFromClipboard => {
				dispatch(checkForTheSameTextInClipboard(textFromClipboard, copiedColorReducer[hsl.defaultFormatToCopy]))
				dispatch(checkForTheSameUrlInClipboard(textFromClipboard, urlAddress))
			})
	}

	function getRandomColor () {
		let generatedHSL = { ...hsl, ...getRandomGeneratedHSL() }
		dispatch(selectHSL(generatedHSL))
		updateFirestore('hsl', generatedHSL, STARTED_COLLECTION, currentUser)
	}

	function updateClipboard (textToCopy) {
		toReadTextFromClipboard()
			.then(textFromClipboard => {
				if (isTextTheSame(textFromClipboard, textToCopy)) {
					throw new Error('text is already in clipboard')
				} else {
					addNewNotification(`${hsl.defaultFormatToCopy} color copied successfully`)
					toWriteTextIntoClipboard(textToCopy)
					checkForTheSameTextIn()
				}
			})
			.catch(error => {
				addNewNotification(error.message, 'error')
			})
	}

	function removeNotification(notificationID) {
		let newNotificationList = notifications
			.filter(notification => notification.id !== notificationID)
		
		setNotifications(newNotificationList)
	}

	React.useEffect(() => {
		onAuthStateChanged(auth, user => {
			if (user) {
				setCurrentUser(user.uid)
			}
		})		
	}, [])

	React.useEffect(() => {
		dispatch(reformatFormats(hsl))
	}, [hsl.hue, hsl.saturation, hsl.lightness])

	React.useEffect(() => {
		setDataIntoLocalStorage('hsl', hsl)
		checkForTheSameTextIn()
		updateUrlAdress(hsl)
	}, [hsl])

	React.useEffect(() => {
		checkForTheSameTextIn()
	}, [copiedColorReducer.hsl])

	window.onkeypress = (e) => {
		if (e.code === 'Space') {
			getRandomColor()
		} else if (e.code === 'Enter') {
			updateClipboard(copiedColorReducer[hsl.defaultFormatToCopy])
		}
	}

	window.onfocus = () => { checkForTheSameTextIn() }

	window.ononline = e => { updateAppOnlineStatus(true) }

	window.onoffline = e => { updateAppOnlineStatus(false) }

	return (
		!isAppOnline
			? <NotFound />
			: <>
				<div className="rootWrapper">
					<Notifications
						notifications={notifications}
						removeNotification={removeNotification}
					/>
					<Title
						isLoading={isLoading}
						currentUser={currentUser}
					/>
					<Main
						isLoading={isLoading}
						updateLoadingState={updateLoadingState}
						updateClipboard={updateClipboard}
						addNewNotification={addNewNotification}
						currentUser={currentUser}
					/>
					<Options
						isLoading={isLoading}
						getRandomColor={getRandomColor}
						checkForTheSameTextIn={checkForTheSameTextIn}
						updateLoadingState={updateLoadingState}
						addNewNotification={addNewNotification}
						currentUser={currentUser}
						setCurrentUser={setCurrentUser}
					/>
				</div>
			</>
	)
}

export default App