import React, { useState, useEffect } from "react";

import { useDispatch, useSelector } from "react-redux"
import { selectHue, selectSaturation, selectLightness, selectAlpha, resetHue, resetSaturation, resetLightness, resetAplha, getRandomColor } from './store/hslReducer/actions.js'


import styles from './App.module.sass'

import { getRandomGeneratedNumber, getFormatted, toCopyColor } from './services/services.js'

const App = () => {
	const hsl = useSelector(state => state)

	const [ formattedHSLA, setFormattedHSLA ] = useState(null)
	const [ formattedGRBA, setFormattedRGBA ] = useState(null)
	const [ formattedHEXA, setFormattedHEXA ] = useState(null)

	const dispatch = useDispatch()

	useEffect(() => {
		let { hue, saturation, lightness, alpha} = hsl.hslReducer
		let {hsla, rgba, hexa} = getFormatted(hue, saturation, lightness, alpha)

		setFormattedHSLA(hsla)
		setFormattedRGBA(rgba)
		setFormattedHEXA(hexa)
	}, [hsl.hslReducer])

	const changeHue = e => dispatch(selectHue(e.target.value))
	const changeSaturation = e => dispatch(selectSaturation(e.target.value))
	const changeLightness = e => dispatch(selectLightness(e.target.value))
	const changeAplha = e => dispatch(selectAlpha(e.target.value))

	const toResetHue = () => dispatch(resetHue())
	const toResetSaturation = () => dispatch(resetSaturation())
	const toResetLightness = () => dispatch(resetLightness())
	const toResetAplha = () => dispatch(resetAplha())

	const toGetRandomColor = () => dispatch(getRandomColor())

	return (
		<div
			style={{backgroundColor: formattedHSLA}}
			onClick={(e) => toCopyColor(e)}>
			<div onClick={(e) => toCopyColor(e)}>
				<h2>{formattedHSLA}</h2>
				<h2>{formattedGRBA}</h2>
				<h2>{formattedHEXA}</h2>
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