import React, { useState, useEffect, useRef } from "react";

import { useDispatch, useSelector } from "react-redux"
import { selectHSLA, resetHue, resetSaturation, resetLightness, resetAplha, getRandomColor, getNewDefaultColorToCopy } from './store/hslReducer/actions.js'

import { reformatFormats } from './store/copiedColorReducer/actions.js'

import styles from './App.module.sass'

import { getRandomGeneratedNumber, getFormatted, toCopyColor, getFormattedHSLA } from './services/services.js'

const App = () => {
	const store = useSelector(state => state)
	const dispatch = useDispatch()

	const inputHue = useRef(null)
	const inputSaturation = useRef(null)
	const inputLightness = useRef(null)
	const inputAlpha = useRef(null)

	const [ favorites, setFavorites ] = useState([])
	const [ isUniqueColor, setIsUniqueColor ] = useState(true)

	const [ history, updateHistory ] = useState([])

	const isUnique = () => {
		let formattedNewColorHSLA = getFormattedHSLA(store.hslReducer)

		let isNewColorUnique = favorites.every(item => getFormattedHSLA(item) !== formattedNewColorHSLA)

		return isNewColorUnique
	}

	useEffect(() => {

		dispatch(reformatFormats(store.hslReducer))

	}, [store.hslReducer])

	useEffect(() => {

		setIsUniqueColor(isUnique())

	}, [store.hslReducer, favorites])

	const changeHSLA = () => {
		let
			hue = inputHue.current.value,
			saturation = inputSaturation.current.value,
			lightness = inputLightness.current.value,
			alpha = inputAlpha.current.value

		dispatch(selectHSLA({ hue, saturation, lightness, alpha }))
	}

	const toResetHue = () => dispatch(resetHue())
	const toResetSaturation = () => dispatch(resetSaturation())
	const toResetLightness = () => dispatch(resetLightness())
	const toResetAplha = () => dispatch(resetAplha())

	const toGetRandomColor = () => dispatch(getRandomColor())
	
	const toUpdateDefaultFormat = e => {
		e.stopPropagation()
		dispatch(getNewDefaultColorToCopy(e.target.dataset.formatToCopy))
	}

	const toCopyColorToClipboard = () => toCopyColor(store.copiedColorReducer[store.hslReducer.defaultFormatToCopy])

	const toAddToFavorite = () => {
		if (!isUnique()) return

		let { hue, saturation, lightness, alpha } = store.hslReducer

		setFavorites(prev => [ { hue, saturation, lightness, alpha, id: Date.now() }, ...prev])
	}

	const toRemoveFromFavorite = () => {
		let newFavorites =favorites.filter(item => item.hue !== store.hslReducer.hue)

		setFavorites(prev => [...newFavorites])
	}

	// console.log(isUniqueColor)


	return (
		<div
			className="rootWrapper"
			style={{backgroundColor: store.copiedColorReducer.hsla}}
			onClick={() => toCopyColorToClipboard()}>

			<div>
				<h2 style={{'filter': `opacity(${store.hslReducer.defaultFormatToCopy === 'hsla' ? 1 : 0.5})`}} data-format-to-copy="hsla" onClick={e => toUpdateDefaultFormat(e)}>{store.copiedColorReducer.hsla}</h2>
				<h2 style={{'filter': `opacity(${store.hslReducer.defaultFormatToCopy === 'rgba' ? 1 : 0.5})`}} data-format-to-copy="rgba" onClick={e => toUpdateDefaultFormat(e)}>{store.copiedColorReducer.rgba}</h2>
				<h2 style={{'filter': `opacity(${store.hslReducer.defaultFormatToCopy === 'hexa' ? 1 : 0.5})`}} data-format-to-copy="hexa" onClick={e => toUpdateDefaultFormat(e)}>{store.copiedColorReducer.hexa}</h2>
			</div>
			<div>
				<input
					ref={inputHue}
					onChange = {() => changeHSLA()}
					type="range" min="0" max="360" step="1"
					value={store.hslReducer.hue}/>
				<label onDoubleClick = {() => toResetHue()} htmlFor="">hue</label>
			</div>

			<div>
				<input
					ref={inputSaturation}
					onChange = {() => changeHSLA()} 
					type="range"  min="0" max="100" step="1"
					value={store.hslReducer.saturation} />
				<label onDoubleClick = {() => toResetSaturation()} htmlFor="">saturation</label>
			</div>

			<div>
				<input
					ref={inputLightness}
					onChange = {() => changeHSLA()}
					type="range"  min="0" max="100" step="1"
					value={store.hslReducer.lightness} />
				<label onDoubleClick = {() => toResetLightness()} htmlFor="">lightness</label>
			</div>

			<div>
				<input
					ref={inputAlpha}
					onChange = {() => changeHSLA()}
					type="range"  min="0" max="1" step="0.01"
					value="1" value={store.hslReducer.alpha} />
				<label onDoubleClick = {() => toResetAplha()} htmlFor="">alpha</label>
			</div>

			<div>
				<input type="button" onClick={() => toGetRandomColor()} value="Random" />
				<input type="button" onClick={() => {isUniqueColor ? toAddToFavorite() : toRemoveFromFavorite()}} value={`${isUniqueColor ? 'ADD' : 'REMOVE'}`} />
			</div>

			<div className="favoriteCellList">
				{
					favorites.map(item => {

						return (
							<div
								key={item.id}
								colorID={item.id}
								className="favoriteCell"
								style={{backgroundColor: getFormattedHSLA(item)}}
								onClick={() => dispatch(selectHSLA(item))}
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