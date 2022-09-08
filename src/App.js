import React, { useState, useEffect } from "react";

import { Main, Title, Options, Notification } from '@components/index.js'

import { useDispatch, useSelector } from "react-redux"

import { selectHSL } from './store/hslReducer/actions.js'

import { reformatFormats, checkForTheSameUrlInClipboard, checkForTheSameTextInClipboard} from './store/copiedColorReducer/actions.js'

import styles from './App.module.sass'

import { STARTED_COLLECTION } from '@/consts.js'

import { getStartedColor, setDataIntoLocalStorage, toReadTextFromClipboard, getUrlAddress, toWriteTextIntoClipboard } from '@utils/utils.js'

import { unsub, getCollectionFromFireStore, getDataFromFireStore } from '@utils/firestoreUtils.js'

import { auth } from './../firebase-config.js'

const App = () => {
	const hsl = useSelector(state => state.hsl)
	const dispatch = useDispatch()
	const copiedColorReducer = useSelector(state => state.copiedColorReducer)

	const [ refHue, setRefHue ] = useState(hsl.hue) 
	const [ refSaturation, setRefSaturation ] = useState(hsl.saturation) 
	const [ refLightness, setRefLightness ] = useState(hsl.lightness) 

	const [ currentUser, setCurrentUser ] = useState(() => {
		let currentUser = localStorage.getItem('currentUser')
		if (currentUser) return currentUser

		localStorage.setItem('currentUser', Date.now())
		return localStorage.getItem('currentUser')
	}) 

	let hslSub

	const [ notifications, setNotifications ] = useState([
	// {
	// 	id: 1662638384593,
	// 	massage
	// },
	// {
	// 	id: 1662638385953
	// 	id: 1662638385954

	// },
	// {
	// 	id: 1662638385954
	// }
	])

	function changeHSL () {
		let
			hue = refHue,
			saturation = refSaturation,
			lightness = refLightness

		dispatch(selectHSL({ hue, saturation, lightness }))
		setDataIntoLocalStorage('hsl', { hue, saturation, lightness, defaultFormatToCopy: hsl.defaultFormatToCopy })
	}

	function updateHslStateViaFirestore (actualDataFromFirestore) {
		let { hue, saturation, lightness } = actualDataFromFirestore.hsl
		dispatch(selectHSL({ hue, saturation, lightness }))
	}
	
	function handlerDocumentKeypress (e) {
		if (e.code === "Enter") {
			e.preventDefault()
			toWriteTextIntoClipboard(copiedColorReducer[hsl.defaultFormatToCopy])
		}
	}

	function oneTimeChanged (fn, value) {fn (prev => +prev + value) }

	useEffect(() => {
		console.log('currentUser', currentUser)
		localStorage.setItem('currentUser', currentUser)

		if (auth.currentUser?.uid)
			setCurrentUser(auth.currentUser.uid)

		getCollectionFromFireStore(STARTED_COLLECTION, currentUser)
			.then(collection => getDataFromFireStore(collection, 'hsl'))
			.then(dataFromFireStore => {
				let { hue, saturation, lightness } = dataFromFireStore
				dispatch(selectHSL({ hue, saturation, lightness }))
				hslSub = unsub(updateHslStateViaFirestore, STARTED_COLLECTION, currentUser)
			})
	}, [currentUser])

	useEffect(() => {
		let  {hue, saturation, lightness} = hsl

		setRefHue (hue)
		setRefSaturation (saturation)
		setRefLightness (lightness)

		dispatch(reformatFormats(hsl))
	}, [hsl])

	useEffect(() => {
		changeHSL()
	}, [refHue, refSaturation, refLightness])
	
	window.onfocus = () => {
		let urlAddress = getUrlAddress()
		toReadTextFromClipboard()
			.then(data => {
				dispatch(checkForTheSameTextInClipboard(data, copiedColorReducer[hsl.defaultFormatToCopy]))
				dispatch(checkForTheSameUrlInClipboard(data, urlAddress))
			})
	}

	useEffect(() => {
		console.log(auth)

		document.addEventListener('keyup', handlerDocumentKeypress)

		getCollectionFromFireStore(STARTED_COLLECTION, currentUser)
			.then(collection => getDataFromFireStore(collection, 'hsl')
			.then(dataFromFireStore => {
				let { hue, saturation, lightness } = dataFromFireStore
				dispatch(selectHSL({ hue, saturation, lightness }))
				hslSub = unsub(updateHslStateViaFirestore, STARTED_COLLECTION, currentUser)
			}))

		return () => {
			typeof hslSub === "function" && hslSub()
			document.removeEventListener('keyup', handlerDocumentKeypress)
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

	return (
		<div className="rootWrapper">
			<div className="notifications">
				{
					notifications.map(notification => {
						return (
							<Notification
								key={notification}
							/>
						)
					})
				}
				
			</div>
			<Title />
			<Main
				currentUser={currentUser}
				sliders={slidersConfig}
				oneTimeChanged={oneTimeChanged}
			/>
			<Options
				currentUser={currentUser}
				setCurrentUser={setCurrentUser}
				setNotifications={setNotifications}
			/>
		</div>
	)
}

export default App