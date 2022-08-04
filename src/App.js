import React, { useState, useEffect, useRef } from "react";

import { Slider, Board } from '@components/index.js'

import { createStore, useDispatch, useSelector } from "react-redux"
import { selectHSL, getRandomColor, getNewDefaultColorToCopy } from './store/hslReducer/actions.js'

import { reformatFormats } from './store/copiedColorReducer/actions.js'

import useLocalStorage from '@hooks/useLocalStorage.js'

import styles from './App.module.sass'

import { LS_MAIN_KEY, INITIAL_HUE, INITIAL_SATURATION, INITIAL_LIGHTNESS } from '@/consts.js'
// import * as firebase from 'firebase/app'

import { parseAddressBar, getRandomGeneratedNumber, getFormatted, toCopyColorInClipboard, getFormattedHSL } from '@utils/utils.js'

// import firebase from './firebase'

const App = () => {
	const hsl = useSelector(state => state.hsl)
	const dispatch = useDispatch()
	const copiedColorReducer = useSelector(state => state.copiedColorReducer)

	const [ favoritesLS, setFavoritesLS ] = useLocalStorage('favoriteColorsList', [])
	const [ stateLS, setStateLS ] = useLocalStorage(LS_MAIN_KEY, hsl)
	const [ isUniqueColor, setIsUniqueColor ] = useState(true)

	const [ refHue, setRefHue ] = useState(INITIAL_HUE) 
	const [ refSaturation, setRefSaturation ] = useState(INITIAL_SATURATION) 
	const [ refLightness, setRefLightness ] = useState(INITIAL_LIGHTNESS) 

	// const db = firebase.firestore()

	const isUnique = () => {
		let formattedNewColorHSLA = getFormattedHSL(hsl)
		let isNewColorUnique = favoritesLS.every(item => getFormattedHSL(item) !== formattedNewColorHSLA)

		return isNewColorUnique
	}

	const changeHSL = () => {
		let
			hue = refHue,
			saturation = refSaturation,
			lightness = refLightness

		dispatch(selectHSL({ hue, saturation, lightness }))
	}

	
	const toAddToFavorite = () => {
		if (!isUnique()) return

		let { hue, saturation, lightness } = hsl

		setFavoritesLS(prev => [ { hue, saturation, lightness, id: Date.now() }, ...prev])
	}

	const toRemoveFromFavorite = () => {
		let newFavorites = favoritesLS.filter(item => item.hue !== hsl.hue)

		setFavoritesLS(prev => [...newFavorites])
	}


	const handlerDocumentKeypress = (e) => {
		if (e.code === "Space")
			toGetRandomColor()
		if (e.code === "Enter") {
			e.preventDefault()
			console.log(copiedColorReducer)
			toCopyColorInClipboard(copiedColorReducer[hsl.defaultFormatToCopy])
		}
	}

	const oneTimeChanged = (fn, value) => { fn (prev => prev + value) }

	const toGetRandomColor = () => dispatch(getRandomColor())

	function getGetQuery(actualState) {
		return Object.keys(actualState).map(item => `${item}=${actualState[item]}&&`).join('')
	}

	function updateHistory () {
		let getQuery = getGetQuery(hsl)

		let baseUrl = window.location.protocol + "//" + window.location.host + window.location.pathname;
		let newUrl = `${baseUrl}?${getQuery}`
		
		history.pushState(null, null, newUrl);
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

	useEffect(() => { setIsUniqueColor(isUnique()) }, [hsl, favoritesLS])

	useEffect(() => { changeHSL() }, [refHue, refSaturation, refLightness])
	
	useEffect(() => {
		document.addEventListener('keyup', handlerDocumentKeypress)
		return () => document.removeEventListener('keyup', handlerDocumentKeypress)
	}, [])

	return (
		<div
			className="rootWrapper">

			<Board />

			<Slider 
				oneTimeChanged={oneTimeChanged}
				relatedValue='hue'
				setRef={setRefHue}
				min={0}
				max={360}
			/>

			<Slider 
				oneTimeChanged={oneTimeChanged}
				relatedValue='saturation'
				setRef={setRefSaturation}
				min={0}
				max={100}
			/>

			<Slider 
				oneTimeChanged={oneTimeChanged}
				relatedValue='lightness'
				setRef={setRefLightness}
				min={0}
				max={100}
			/>

			<div className="favoriteCellList">
				<div
					className="favoriteCell"
					onClick={() => {}}>
					Q
				</div>
				<div
					className="favoriteCell"
					onClick={() => {}}>
					H
				</div>
				<div
					className="favoriteCell"
					onClick={() => {}}>
					C
				</div>
				<div
					className="favoriteCell"
					onClick={() => {}}>
					U
				</div>
				<div
					className="favoriteCell"
					onClick={() => toGetRandomColor()}>
					R
				</div>
				<div
					className="favoriteCell"
					onClick={() => {isUniqueColor ? toAddToFavorite() : toRemoveFromFavorite()}}>
					{`${isUniqueColor ? '+' : '-'}`}
				</div>

				{
					favoritesLS.map(item => {
						return (
							<div
								key={item.id}
								className="favoriteCell"
								style={{backgroundColor: getFormattedHSL(item)}}
								onClick={() => dispatch(selectHSL(item))}
							> 
							</div>
						)
					})
				}
			</div>

		</div>
	)
}

export default App