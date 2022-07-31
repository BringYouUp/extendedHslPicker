import React, { useState, useEffect, useRef } from "react";

import { addListeners, removeListeners, addStyleProperties, removeStyleProperties } from '@utils/utils.js'

import { createStore, useDispatch, useSelector } from "react-redux"

import { resetValueOfHSL } from '@store/hslReducer/actions.js'

const Slider = ({ oneTimeChanged, relatedValue, setRef, min, max }) => {
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

	function removeBounceEffect() {
		removeStyleProperties(sliderPoint.current, ['top', 'transform'])
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

		removeBounceEffect()
	}

	function handleClickPosition () {
		return {
			startSliderTrack: sliderTrack.current.offsetLeft,
			sliderTrackWidth: sliderTrack.current.offsetWidth,
		}
	}

	function addBounceEffect (e) {
		let { startSliderTrack, sliderTrackWidth } = handleClickPosition()

		let clickOffset = 0

		addStyleProperties(sliderPoint.current, {
			top: '-2rem',
			transform: 'scale(1.5)'
		})

		if (e.type === 'touchmove' || e.type === 'touchstart')
			clickOffset = e.touches[0].pageX - startSliderTrack

		if (e.type === 'mousemove' || e.type === 'mousedown')
			clickOffset = e.pageX - startSliderTrack

		if (clickOffset < 0 || clickOffset > sliderTrackWidth) return

		let progress = Math.trunc(parseInt(clickOffset) * 100 / sliderTrackWidth)
		let newValue = Math.trunc(progress / 100 * max )

		setRef(newValue)
	}
	
	function oneTimeChanged_ (e) {
		let { startSliderTrack, sliderTrackWidth } = handleClickPosition()

		let clickOffset = e.pageX

		let isClickOnTheLeft = clickOffset < sliderTrack.current.offsetLeft

		if (hsl[relatedValue] === min && isClickOnTheLeft) return
		if (hsl[relatedValue] === max && !isClickOnTheLeft) return

		if (isClickOnTheLeft)
			oneTimeChanged(setRef, -1)
		else
			oneTimeChanged(setRef, 1)
	}

	function toCheckForResetValue (e) {
		let { startSliderTrack, sliderTrackWidth } = handleClickPosition()


		let clickOffset = e.pageX
		let isClickWithinSlider = clickOffset > startSliderTrack && clickOffset < sliderTrackWidth + startSliderTrack

		console.log(isClickWithinSlider)
		if (isClickWithinSlider)
			dispatch(resetValueOfHSL(relatedValue))
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
			onClick={(e) => oneTimeChanged_(e)}
		>
			<div
				className="sliderWrapperInner"
				style={{background: generateBackgroundColorForSliderTrack(relatedValue)}}>
				
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

export default Slider