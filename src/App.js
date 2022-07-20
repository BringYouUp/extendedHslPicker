import React, { useState, useEffect, useRef } from "react";

import { Slider, Board } from '@components/index.js'

import { createStore, useDispatch, useSelector } from "react-redux"
import { selectHSL, resetValueOfHSL, getRandomColor, getNewDefaultColorToCopy } from './store/hslReducer/actions.js'

import { reformatFormats } from './store/copiedColorReducer/actions.js'

import useLocalStorage from '@hooks/useLocalStorage.js'

import styles from './App.module.sass'

import { INITIAL_HUE, INITIAL_SATURATION, INITIAL_LIGHTNESS } from '@/consts.js'
// import * as firebase from 'firebase/app'

import { getRandomGeneratedNumber, getFormatted, toCopyColor, getFormattedHSL } from '@utils/utils.js'

// import firebase from './firebase'

const App = () => {
	const hsl = useSelector(state => state.hsl)
	const copiedColorReducer = useSelector(state => state.copiedColorReducer)
	const dispatch = useDispatch()
	const [ favorites, setFavorites ] = useLocalStorage('favoriteColorsList', [])

	const [ isUniqueColor, setIsUniqueColor ] = useState(true)

	// const db = firebase.firestore()

	const [ refHue, setRefHue ] = useState(INITIAL_HUE) 
	const [ refSaturation, setRefSaturation ] = useState(INITIAL_SATURATION) 
	const [ refLightness, setRefLightness ] = useState(INITIAL_LIGHTNESS) 

	const setRefValue = ref => {

	}


	const isUnique = () => {
		let formattedNewColorHSLA = getFormattedHSL(hsl)

		let isNewColorUnique = favorites.every(item => getFormattedHSL(item) !== formattedNewColorHSLA)

		return isNewColorUnique
	}

	useEffect(() => { dispatch(reformatFormats(hsl)) }, [hsl])

	useEffect(() => { setIsUniqueColor(isUnique()) }, [hsl, favorites])

	const changeHSL = () => {
		let
			hue = refHue,
			saturation = refSaturation,
			lightness = refLightness

		dispatch(selectHSL({ hue, saturation, lightness }))
	}

	const toGetRandomColor = () => dispatch(getRandomColor())
	
	const toUpdateDefaultFormat = e => {
		dispatch(getNewDefaultColorToCopy(e.target.dataset.formatToCopy))
	}

	const toCopyColorToClipboard = () => {
		toCopyColor(copiedColorReducer[hsl.defaultFormatToCopy])
	}

	const toAddToFavorite = () => {
		if (!isUnique()) return

		let { hue, saturation, lightness } = hsl

		setFavorites(prev => [ { hue, saturation, lightness, id: Date.now() }, ...prev])
	}

	const toRemoveFromFavorite = () => {
		let newFavorites = favorites.filter(item => item.hue !== hsl.hue)

		setFavorites(prev => [...newFavorites])
	}

	useEffect(() => {
		// console.log('change HSL')
		changeHSL()
	 }, [refHue, refSaturation, refLightness])

	useEffect(() => { toCopyColorToClipboard() }, [hsl.defaultFormatToCopy])

	useEffect(() => {
		// console.log('main', hsl)
	}, [hsl])

	const handlerDocumentKeypress = (e) => {
		// console.log(e.code)
		if (e.code === "Space")
			toGetRandomColor()
		if (e.code === "Enter") {
			toCopyColorToClipboard()
			// alert('copied')

		}
	}

	// console.log(hsl)
	const toResetValue = relatedValue => {
		dispatch(resetValueOfHSL(relatedValue))
	}

	const oneTimeChanged = (fn, value) => { fn(prev => prev + value) }

	useEffect(() => {
		document.addEventListener('keyup', handlerDocumentKeypress)
		return () => document.removeEventListener('keyup', handlerDocumentKeypress)
	}, [])

	return (
		<div
			className="rootWrapper">
			

			<Board
				toUpdateDefaultFormat={toUpdateDefaultFormat}
			/>

			<Slider 
				oneTimeChanged={oneTimeChanged}
				relatedValue='hue'
				setRef={setRefHue}
				toResetValue={toResetValue}
				min={0}
				max={360}
			/>

			<Slider 
				oneTimeChanged={oneTimeChanged}
				relatedValue='saturation'
				setRef={setRefSaturation}
				toResetValue={toResetValue}
				min={0}
				max={100}
			/>

			<Slider 
				oneTimeChanged={oneTimeChanged}
				toResetValue={toResetValue}
				relatedValue='lightness'
				setRef={setRefLightness}
				min={0}
				max={100}
			/>

			<div>
				
			</div>

			<div className="favoriteCellList">
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
					favorites.map(item => {

						return (
							<div
								key={item.id}
								// colorid={item.id}
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