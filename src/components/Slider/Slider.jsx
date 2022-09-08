import React, { useState, useEffect, useRef, useLayoutEffect} from "react";

import { updateUrlAdress, addStyleProperties , removeStyleProperties,  generateBackgroundColorForSliderPoint , generateBackgroundColorForSliderTrack } from '@utils/utils.js'

import { useDispatch, useSelector } from "react-redux"

import { resetValueOfHSL } from '@store/hslReducer/actions.js'

import { unsub, updateFirestore } from '@utils/firestoreUtils.js'

export default function Slider ({ currentUser, oneTimeChanged, relatedValue, setRef, min, max }) {
	const dispatch = useDispatch()
	const hsl = useSelector(state => state.hsl)
	const copiedColorReducer = useSelector(state => state.copiedColorReducer)

	const sliderWrapper = useRef(null)
	const sliderTrack = useRef(null)
	const sliderPoint = useRef(null)

	const [ offset, setOffset ] = useState(0)

	const startCollection = 'users'

	function removeBounceEffectListener (e) {
		removeStyleProperties(sliderPoint.current, ['top', 'transform'])
		updateUrlAdress(hsl)
		updateFirestore('hsl', hsl, startCollection, currentUser)
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
		// e.preventDefault()
		if (e.type === 'mousemove' && e.nativeEvent.which !== 1) return

		let [ startSliderTrack, sliderTrackWidth ] = getRefValues(sliderTrack, ['offsetLeft', 'offsetWidth'])
		let clickOffset = 0

		addStyleProperties(sliderPoint.current, {
			top: '-2.5rem',
			transform: 'scale(2)'
		})

		// if (e.type === 'touchmove') {
		// 	e.preventDefault()
		// }

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

		if (isClickWithinSlider && relatedValue !== 'hue')
			dispatch(resetValueOfHSL(relatedValue))
	}

	useEffect(() => {
		setOffset(sliderTrack.current.offsetWidth * (hsl[relatedValue] / max) - 8)
	}, [ hsl ])
		
	return (
		<div
			ref={sliderWrapper}
			className="sliderWrapper"
			onMouseDown={addBounceEffect}
			onMouseUp={removeBounceEffectListener}
			onTouchStart={addBounceEffect}
			onTouchEnd={removeBounceEffectListener}
			onMouseLeave={removeBounceEffectListener}
			onMouseMove={addBounceEffect}
			onTouchMove={addBounceEffect}
		>
			<div
				className="sliderWrapperInner"
				style={
					{
						background: generateBackgroundColorForSliderTrack(relatedValue, hsl)
					}}
				onClick={(e) => { oneTimeChanged_(e)}}
			>
				<div ref={sliderTrack}
					className="sliderTrack"
					onDoubleClick={toCheckForResetValue}
				>
					<div 
						ref={sliderPoint}
						style={
							{
								backgroundColor: generateBackgroundColorForSliderPoint(relatedValue, hsl),
								left: offset + 'px'
							}}
						className="sliderPoint"
						onDoubleClick={toCheckForResetValue} 
					/>	
				</div>

			</div>
		</div>
	)
}

