import React, { useState, useEffect, useRef } from "react";

import { Main, Title, Slider, Board, Options } from '@components/index.js'

import { createStore, useDispatch, useSelector } from "react-redux"
import { selectHSL, getRandomColor, getNewDefaultColorToCopy } from './store/hslReducer/actions.js'

import { reformatFormats } from './store/copiedColorReducer/actions.js'

import useLocalStorage from '@hooks/useLocalStorage.js'

import styles from './App.module.sass'

import { IMG_BACK, IMG_HELP, IMG_COPY_COLOR, IMG_COPY_URL, IMG_RANDOM, IMG_ADD, IMG_ADDED, IMG_OPENED_LIST, IMG_CLOSED_LIST } from '@/resources.js'

import { LS_MAIN_KEY, INITIAL_HUE, INITIAL_SATURATION, INITIAL_LIGHTNESS } from '@/consts.js'
// import * as firebase from 'firebase/app'

import { addListeners, parseAddressBar, getRandomGeneratedNumber, getFormatted, toCopyColorToClipboard, getFormattedHSL } from '@utils/utils.js'

// import firebase from './firebase'

const App = () => {
	const hsl = useSelector(state => state.hsl)
	const dispatch = useDispatch()
	const copiedColorReducer = useSelector(state => state.copiedColorReducer)

	const [ stateLS, setStateLS ] = useLocalStorage(LS_MAIN_KEY, hsl)

	const [ refHue, setRefHue ] = useState(INITIAL_HUE) 
	const [ refSaturation, setRefSaturation ] = useState(INITIAL_SATURATION) 
	const [ refLightness, setRefLightness ] = useState(INITIAL_LIGHTNESS) 

	// const db = firebase.firestore()

	function changeHSL () {
		let
			hue = refHue,
			saturation = refSaturation,
			lightness = refLightness

		dispatch(selectHSL({ hue, saturation, lightness }))
	}
	
	function handlerDocumentKeypress (e) {
		if (e.code === "Space")
			dispatch(getRandomColor())
		if (e.code === "Enter") {
			e.preventDefault()
			toCopyColorToClipboard(copiedColorReducer[hsl.defaultFormatToCopy])
		}
	}

	function oneTimeChanged (fn, value) {fn (prev => +prev + value) }

	function getGetQuery(actualState) {
		return Object.keys(actualState).map(item => `${item}=${actualState[item]}&&`).join('')
	}

	function updateHistory () {
		let getQuery = getGetQuery(hsl)

		let baseUrl = window.location.protocol + "//" + window.location.host + window.location.pathname;
		let newUrl = `${baseUrl}?${getQuery}`
		
		history.replaceState({}, copiedColorReducer.hsl, newUrl);
	} 

	useEffect(() => {
		let  {hue, saturation, lightness} = hsl

		setRefHue (hue)
		setRefSaturation (saturation)
		setRefLightness (lightness)

		updateHistory()
		setStateLS(prev => hsl)
		dispatch(reformatFormats(hsl))
	}, [hsl])

	useEffect(() => { changeHSL() }, [refHue, refSaturation, refLightness])
	
	useEffect(() => {
		document.addEventListener('keyup', handlerDocumentKeypress)
		return () => document.removeEventListener('keyup', handlerDocumentKeypress)
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
			<Title />
			<Main sliders={slidersConfig} oneTimeChanged={oneTimeChanged} />
			<Options />
		</div>
	)
}

export default App