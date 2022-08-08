import React, { useState, useEffect, useRef } from "react";

import { addListeners, removeListeners, addStyleProperties, removeStyleProperties } from '@utils/utils.js'

import { createStore, useDispatch, useSelector } from "react-redux"

import { resetValueOfHSL } from '@store/hslReducer/actions.js'

export default function Slider ({ oneTimeChanged, relatedValue, setRef, min, max }) {
	const dispatch = useDispatch()
	const hsl = useSelector(state => state.hsl)
	
	const sliderWrapper = useRef(null)
	const sliderTrack = useRef(null)
	const sliderPoint = useRef(null)

	const [ offset, setOffset ] = useState(0)

	let sliderWrapperInitListeners = {
			mouseleave: removeBounceEffectListener,
			mousedown: addBounceEffectListener,
			mouseup: removeBounceEffectListener,
			touchstart: addBounceEffectListener,
			touchend: removeBounceEffectListener,
		}

	function addBounceEffectListener (e) {
		addListeners (sliderWrapper.current, {
			mousemove: addBounceEffect,
			touchmove: addBounceEffect
		})

		addBounceEffect(e)
	}

	function removeBounceEffectListener (e) {
		removeListeners (sliderWrapper.current, {
			mousemove: addBounceEffect,
			touchmove: addBounceEffect
		})

		removeStyleProperties(sliderPoint.current, ['top', 'transform'])
	}

	function getRefValues (node, params) {
		let returnedValues = []

		for (let parameter of params) {
			let appropriateValue = node.current[parameter]
			returnedValues.push(appropriateValue)
		}

		return returnedValues
	}

	function addBounceEffect (e) {
		let [ startSliderTrack, sliderTrackWidth ] = getRefValues(sliderTrack, ['offsetLeft', 'offsetWidth'])
		let clickOffset = 0

		addStyleProperties(sliderPoint.current, {
			top: '-2rem',
			transform: 'scale(1.5)'
		})

		if (e.type === 'touchmove') {
			e.preventDefault()
		}

		if (e.type === 'touchmove' || e.type === 'touchstart') {
			clickOffset = e.touches[0]?.pageX - startSliderTrack
		}

		if (e.type === 'mousemove' || e.type === 'mousedown') {
			clickOffset = e.pageX - startSliderTrack
		}

		if (clickOffset < 0 || clickOffset > sliderTrackWidth) return

		let progress = Math.trunc(parseInt(clickOffset) * 100 / sliderTrackWidth)
		let newValue = Math.trunc(progress / 100 * max )

		setRef(newValue)
	}

	function toChangeOneTime(value) {
		console.log(value)
		oneTimeChanged(setRef, value)
	}

	function oneTimeChanged_ (e) {
		let [ startSliderTrack, sliderTrackWidth ] = getRefValues(sliderTrack, ['offsetLeft', 'offsetWidth'])
		let clickOffset = e.pageX

		if (clickOffset > startSliderTrack && clickOffset < startSliderTrack + sliderTrackWidth) return

		let isClickOnTheLeft = clickOffset < startSliderTrack
		if (hsl[relatedValue] <= min && isClickOnTheLeft) return
		if (hsl[relatedValue] >= max && !isClickOnTheLeft) return

		if (isClickOnTheLeft)
			oneTimeChanged(setRef, -1)
		else
			oneTimeChanged(setRef, 1)
	}

	function toCheckForResetValue (e) {
		let [ startSliderTrack, sliderTrackWidth ] = getRefValues(sliderTrack, ['offsetLeft', 'offsetWidth'])

		let clickOffset = e.pageX
		let isClickWithinSlider = clickOffset > startSliderTrack && clickOffset < sliderTrackWidth + startSliderTrack

		if (isClickWithinSlider) {
			dispatch(resetValueOfHSL(relatedValue))
		}
	}

	function generateBackgroundColorForSliderTrack (relatedValue) {
		if (relatedValue === 'hue') return `linear-gradient(to right, hsl(0, 100%, 50%), hsl(60, 100%, 50%), hsl(120, 100%, 50%), hsl(180, 100%, 50%), hsl(240, 100%, 50%), hsl(300, 100%, 50%), hsl(360, 100%, 50%))`
		
		let appropriateValue = `hsl(${hsl.hue}, 100%, 50%)`

		if (relatedValue == 'saturation') return `linear-gradient(to right, grey, ${appropriateValue})`
		if (relatedValue === 'lightness') return `linear-gradient(to right, black, ${appropriateValue}, white)`
	} 

	function generateBackgroundColorForSliderPoint (relatedValue) {
		let currentHue = hsl.hue

		if (relatedValue === 'hue') return `hsl(${currentHue}, 100%, 50%)`
		if (relatedValue == 'saturation') return `hsl(${currentHue}, ${hsl[relatedValue]}%, 50%)`
		if (relatedValue === 'lightness') return `hsl(${currentHue}, 100%, ${hsl[relatedValue]}%)`
	}

	useEffect(() => {
		setOffset(sliderTrack.current.offsetWidth * (hsl[relatedValue] / max) - 8)
		
	}, [ hsl ])

	useEffect(() => {
		addListeners(sliderWrapper.current, sliderWrapperInitListeners)
		addListeners(sliderTrack.current, {dblclick: toCheckForResetValue})
		addListeners(sliderPoint.current, {dblclick: toCheckForResetValue})

		return () => {
			removeListeners(sliderWrapper.current, sliderWrapperInitListeners)
			removeListeners(sliderTrack.current, {dblclick: toCheckForResetValue})
			removeListeners(sliderPoint.current, {dblclick: toCheckForResetValue})
		};
	}, [])
			

	return (
		<div
			ref={sliderWrapper}
			className="sliderWrapper"

		>
			<div
				className="sliderWrapperInner"
				style={{background: generateBackgroundColorForSliderTrack(relatedValue)}}
				onClick={(e) => { oneTimeChanged_(e)}}
			>
				<div ref={sliderTrack} className="sliderTrack" >
					<div 
						ref={sliderPoint}
						style={
							{
								backgroundColor: generateBackgroundColorForSliderPoint(relatedValue),
								left: offset + 'px'
							}}
						className="sliderPoint" />	
				</div>

			</div>
		</div>
	)
}

