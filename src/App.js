import React, { useState, useEffect } from "react";

import { Main, Title, Options, Notifications } from '@components/index.js'

import { useDispatch, useSelector } from "react-redux"

import { selectHSL, getNewDefaultColorToCopy } from '@store/hslReducer/actions.js'

import { copyClipboardTextToReducer, reformatFormats, checkForTheSameUrlInClipboard, checkForTheSameTextInClipboard} from '@store/copiedColorReducer/actions.js'

import styles from './App.module.sass'

import { STARTED_COLLECTION } from '@consts/consts.js'

import { getRandomGeneratedHSL, updateUrlAdress, getDataFromLocalStorage, createNotification, isAddressBarIncludeQuery, getStartedColorFromAddressBar, setDataIntoLocalStorage, toReadTextFromClipboard, getUrlAddress, toWriteTextIntoClipboard } from '@utils/utils.js'

import { updateFirestore, unsub, getCollectionFromFireStore, getDataFromFireStore } from '@utils/firestoreUtils.js'

import { onAuthStateChanged  } from "firebase/auth";

import { auth } from './../firebase-config.js'

const App = () => {
	const hsl = useSelector(state => state.hsl)
	const dispatch = useDispatch()
	const copiedColorReducer = useSelector(state => state.copiedColorReducer)

	const [ refHue, setRefHue ] = useState(hsl.hue) 
	const [ refSaturation, setRefSaturation ] = useState(hsl.saturation) 
	const [ refLightness, setRefLightness ] = useState(hsl.lightness) 

	const [ currentUser, setCurrentUser ] = useState(() => {
		let currentUser = String(getDataFromLocalStorage('currentUser'))
		if (currentUser) return currentUser

		setDataIntoLocalStorage('currentUser', Date.now())
		return String(getDataFromLocalStorage('currentUser'))
	}) 

	let hslSub

	const [ notifications, setNotifications ] = useState([])
	const [ isLoading, updateLoadingState ] = useState(true)

	function addNewNotification(...args) {
		let newNotification = createNotification(...args)
		setNotifications(prev => [newNotification, ...prev])
	}

	function changeHSL () {
		let
			hue = refHue,
			saturation = refSaturation,
			lightness = refLightness

		dispatch(selectHSL({ hue, saturation, lightness }))
	}

	function updateHslStateViaFirestore (actualDataFromFirestore) {
		console.log(actualDataFromFirestore)
		let { hue, saturation, lightness } = actualDataFromFirestore.hsl
		dispatch(selectHSL({ hue, saturation, lightness }))
		dispatch(getNewDefaultColorToCopy(actualDataFromFirestore.hsl.defaultFormatToCopy))

		setRefHue(hue)
		setRefSaturation(saturation)
		setRefLightness(lightness)
	}

	function checkForTheSameTextIn() {
		let urlAddress = getUrlAddress()
		
		document.hasFocus() && toReadTextFromClipboard()
			.then(data => {
				dispatch(checkForTheSameTextInClipboard(data, copiedColorReducer[hsl.defaultFormatToCopy]))
				dispatch(checkForTheSameUrlInClipboard(data, urlAddress))
				return toReadTextFromClipboard()
			})
			.then(data => {
				dispatch(copyClipboardTextToReducer(data))
			})
	}

	function synchronizeStateWithFirestore () {
		getCollectionFromFireStore(STARTED_COLLECTION, currentUser)
			.then(collection => getDataFromFireStore(collection, 'hsl'))
			.then(dataFromFireStore => {
				dispatch(selectHSL({ ...dataFromFireStore }))
				hslSub = unsub(updateHslStateViaFirestore, STARTED_COLLECTION, currentUser)
			})
			.finally(() => {
				updateLoadingState(false)
			})
	}

	useEffect(() => {
		setDataIntoLocalStorage('currentUser', currentUser)
		synchronizeStateWithFirestore()

		return () => {
			if (typeof hslSub === "function") {
				hslSub()
			}
		}
	}, [currentUser])

	useEffect(() => {
		setDataIntoLocalStorage('hsl', hsl)
		dispatch(reformatFormats(hsl))
		updateUrlAdress(hsl)
		checkForTheSameTextIn()
	}, [hsl])

	useEffect(() => {
		changeHSL()
	}, [refHue, refSaturation, refLightness])
	

	function getRandomColor () {
		let generatedHSL = { ...getRandomGeneratedHSL(), defaultFormatToCopy: hsl.defaultFormatToCopy }
		updateFirestore('hsl', generatedHSL, STARTED_COLLECTION, currentUser)
	}

	function updateClipboard () {
		toReadTextFromClipboard()
			.then(data => {
				if (data !== copiedColorReducer[hsl.defaultFormatToCopy]) {
					addNewNotification(`${hsl.defaultFormatToCopy} color copied successfully`)
					dispatch(copyClipboardTextToReducer(copiedColorReducer[hsl.defaultFormatToCopy]))
					toWriteTextIntoClipboard(copiedColorReducer[hsl.defaultFormatToCopy])	
				} else {
					addNewNotification('text is already in clipboard', 'error')
				}
			})
			.catch(error => addNewNotification(error.message, 'error'))

		toReadTextFromClipboard()
			.then(data => dispatch(checkForTheSameTextInClipboard(data, copiedColorReducer[hsl.defaultFormatToCopy])))
	}


	window.onkeypress = (e) => {
		if (e.code === "Space") {
			getRandomColor()
		} else if (e.code === "Enter") {
			updateClipboard()
			checkForTheSameTextIn()
		}
	}

	window.onfocus = () => {
		checkForTheSameTextIn()
	}

	function getColorFromSharedURL () {
		let stateFromStartedURL = getStartedColorFromAddressBar() 
		dispatch(selectHSL(stateFromStartedURL))
	}

	useEffect(() => {
		if (isAddressBarIncludeQuery()) {
			// addNewNotification('Get Color from shared URL', 'action', getColorFromSharedURL)
		}

		onAuthStateChanged(auth, user => {
			if (user) {
				setCurrentUser(user.uid)
			}
		})

		return () => {
			if (typeof hslSub === "function") {
				hslSub()
			}
		} 
	}, [])

	const slidersConfig = [
		{
			relatedValue: 'hue',
			min: 0,
			max: 360,
			setRef: setRefHue
		},
		{
			relatedValue: 'saturation',
			min: 0,
			max: 100,
			setRef: setRefSaturation
		},
		{
			relatedValue: 'lightness',
			min: 0,
			max: 100,
			setRef: setRefLightness
		},
	]

	function removeNotification(notificationID) {
		let newNotificationList = notifications
			.filter(notification => notification.id !== notificationID)
		
		setNotifications(newNotificationList)
	}

	return (
		<div className="rootWrapper">
			<Notifications
				isLoading={isLoading}
				notifications={notifications}
				removeNotification={removeNotification}
			/>
			<Title
				isLoading={isLoading}
			/>
			<Main
				isLoading={isLoading}
				addNewNotification={addNewNotification}
				currentUser={currentUser}
				sliders={slidersConfig}
			/>
			<Options
				isLoading={isLoading}
				updateLoadingState={updateLoadingState}
				addNewNotification={addNewNotification}
				currentUser={currentUser}
				setCurrentUser={setCurrentUser}
			/>
		</div>
	)
}

export default App