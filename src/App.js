import React, { useState, useEffect } from "react";

import { useDispatch, useSelector } from "react-redux"
import { selectHue, selectSaturation, selectLightness, selectAlpha, resetHue, resetSaturation, resetLightness, resetAplha, getRandomColor, getNewDefaultColorToCopy } from './store/hslReducer/actions.js'

import { reformatFormats } from './store/copiedColorReducer/actions.js'

import styles from './App.module.sass'

import { getRandomGeneratedNumber, getFormatted, toCopyColor } from './services/services.js'

const App = () => {
	const hsl = useSelector(state => state)
	const dispatch = useDispatch()

	useEffect(() => { dispatch(reformatFormats(hsl.hslReducer)) }, [hsl.hslReducer])

	const changeHue = e => dispatch(selectHue(e.target.value))
	const changeSaturation = e => dispatch(selectSaturation(e.target.value))
	const changeLightness = e => dispatch(selectLightness(e.target.value))
	const changeAplha = e => dispatch(selectAlpha(e.target.value))

	const toResetHue = () => dispatch(resetHue())
	const toResetSaturation = () => dispatch(resetSaturation())
	const toResetLightness = () => dispatch(resetLightness())
	const toResetAplha = () => dispatch(resetAplha())

	const toGetRandomColor = () => dispatch(getRandomColor())
	const toUpdateDefaultFormat = e => {
		e.stopPropagation()
		dispatch(getNewDefaultColorToCopy(e.target.dataset.formatToCopy))
	}

	const toCopyColorToClipboard = () => toCopyColor(hsl.copiedColorReducer[hsl.hslReducer.defaultFormatToCopy])

	return (
		<div
			style={{backgroundColor: hsl.copiedColorReducer.hsla}}
			onClick={() => toCopyColorToClipboard()}>

			<div>
				<h2 style={{'filter': `opacity(${hsl.hslReducer.defaultFormatToCopy === 'hsla' ? 1 : 0.5})`}} data-format-to-copy="hsla" onClick={e => toUpdateDefaultFormat(e)}>{hsl.copiedColorReducer.hsla}</h2>
				<h2 style={{'filter': `opacity(${hsl.hslReducer.defaultFormatToCopy === 'rgba' ? 1 : 0.5})`}} data-format-to-copy="rgba" onClick={e => toUpdateDefaultFormat(e)}>{hsl.copiedColorReducer.rgba}</h2>
				<h2 style={{'filter': `opacity(${hsl.hslReducer.defaultFormatToCopy === 'hexa' ? 1 : 0.5})`}} data-format-to-copy="hexa" onClick={e => toUpdateDefaultFormat(e)}>{hsl.copiedColorReducer.hexa}</h2>
			</div>
			<div>
				<input
					onChange = {(e) => changeHue(e)}
					type="range" min="0" max="360" step="1"
					value={hsl.hslReducer.hue}/>
				<label onDoubleClick = {() => toResetHue()} htmlFor="">hue</label>
			</div>

			<div>
				<input
					onChange = {(e) => changeSaturation(e)} 
					type="range"  min="0" max="100" step="1"
					value={hsl.hslReducer.saturation} />
				<label onDoubleClick = {() => toResetSaturation()} htmlFor="">saturation</label>
			</div>

			<div>
				<input
					onChange = {(e) => changeLightness(e)}
					type="range"  min="0" max="100" step="1"
					value={hsl.hslReducer.lightness} />
				<label onDoubleClick = {() => toResetLightness()} htmlFor="">lightness</label>
			</div>

			<div>
				<input
					onChange = {(e) => changeAplha(e)}
					type="range"  min="0" max="1" step="0.01"
					value="1" value={hsl.hslReducer.alpha} />
				<label onDoubleClick = {() => toResetAplha()} htmlFor="">alpha</label>
			</div>

			<div>
				<input type="button" onClick={() => toGetRandomColor()} value="Random" />
			</div>

		</div>
	)
}

export default App