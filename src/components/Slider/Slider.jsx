import React, { useState, useEffect, useRef } from "react";

import { useDispatch, useSelector } from "react-redux"

import { getFormatted } from '@utils/utils.js'


function useShallowEqualSelector(selector) {
   return useSelector(selector, shallowEqual);
}

const Slider = ({oneTimeChanged, relatedValue, setRef, toResetValue, min, max }) => {
	
	const hsl = useSelector(state => state.hsl)

	const sliderWrapper = useRef(null)
	const sliderTrack = useRef(null)
	const sliderPoint = useRef(null)

	const [ offset, setOffset ] = useState(0)

	const mouseMoveEvent = (e) => e.target == sliderTrack.current && addBounceEffect(e)	

	const removeBounceEffect = () => {
		sliderPoint.current.style.removeProperty('top')
		sliderPoint.current.style.removeProperty('transform')
	}

	const zzz = e => {
		console.log(e)
	}

	const addBounceEffectListener = e => {
		sliderTrack.current.addEventListener('mousemove', mouseMoveEvent)
		sliderTrack.current.addEventListener('touchmove', mouseMoveEvent)
		sliderTrack.current.addEventListener('click', oneTimeChanged_)
		addBounceEffect(e)
	}

	const removeBounceEffectListener = e => {
		sliderTrack.current.removeEventListener('mousemove', mouseMoveEvent)
		sliderTrack.current.removeEventListener('touchmove', mouseMoveEvent)
		sliderTrack.current.removeEventListener('click', oneTimeChanged_)
		removeBounceEffect()
	}

	const addBounceEffect = e => {
		let eOffset = e.offsetX + 1
		let sliderTrackWidth = sliderTrack.current.offsetWidth

		if (eOffset < 0 || eOffset > sliderTrackWidth) return

		let progress = Math.trunc(parseInt(eOffset) * 100 / sliderTrackWidth)
		let newValue = Math.trunc(progress / 100 * max )

		sliderPoint.current.style.top = '-2rem'
		sliderPoint.current.style.transform = 'scale(1.5)'
		setRef(newValue)
	}
	
	// console.log('render', hsl)

	const oneTimeChanged_ = e => {


		let eOffset = e.offsetX + 1
		let sliderTrackWidth = sliderTrack.current.offsetWidth
		// console.log('minor',hsl)
		if (hsl[relatedValue] < min || hsl[relatedValue] > max) return

		// if (eOffset < 0)	oneTimeChanged(setRef, -1)
		// // debugger
		// if (eOffset > sliderTrackWidth) oneTimeChanged(setRef, +1)
	}

	const toCheckForResetValue = e => {
		let eOffset = e.offsetX + 1
		let sliderTrackWidth = sliderTrack.current.offsetWidth

		if (eOffset > 0 && eOffset < sliderTrackWidth) toResetValue(relatedValue)
	}

	const generateBackgroundColorForSliderTrack = relatedValue => {
		if (relatedValue === 'hue') return `linear-gradient(to right, hsl(0, 100%, 50%), hsl(60, 100%, 50%), hsl(120, 100%, 50%), hsl(180, 100%, 50%), hsl(240, 100%, 50%), hsl(300, 100%, 50%), hsl(360, 100%, 50%))`
		
		let appropriateValue = `hsl(${hsl.hue}, 100%, 50%)`

		if (relatedValue == 'saturation') return `linear-gradient(to right, black, ${appropriateValue})`
		if (relatedValue === 'lightness') return `linear-gradient(to right, black, ${appropriateValue}, white)`
	} 

	const generateBackgroundColorForSliderPoint = relatedValue => {
		let currentHue = hsl.hue

		if (relatedValue === 'hue') return `hsl(${currentHue}, 100%, 50%)`
		if (relatedValue == 'saturation') return `hsl(${currentHue}, ${hsl[relatedValue]}%, 50%)`
		if (relatedValue === 'lightness') return `hsl(${currentHue}, 100%, ${hsl[relatedValue]}%)`
	}

	// console.log('перерендер', relatedValue, hsl, offset)

	useEffect(() => {
		// console.log('setOffset')
		// debugger
		setOffset(sliderTrack.current.offsetWidth * (hsl[relatedValue] / max) - 8)
	}, [ hsl ])

	useEffect(() => {
		sliderWrapper.current.addEventListener('mouseleave', removeBounceEffectListener)

		sliderTrack.current.addEventListener('mousedown', addBounceEffectListener)
		sliderTrack.current.addEventListener('mouseup', removeBounceEffectListener)

		sliderTrack.current.addEventListener('touchstart', addBounceEffectListener)
		sliderTrack.current.addEventListener('touchend', removeBounceEffectListener)

		sliderTrack.current.addEventListener('dblclick', toCheckForResetValue)
		sliderPoint.current.addEventListener('dblclick', toCheckForResetValue)

		return () => {
			sliderWrapper.current.removeEventListener('mouseleave', removeBounceEffectListener)

			sliderTrack.current.removeEventListener('mousedown', addBounceEffectListener)
			sliderTrack.current.removeEventListener('mouseup', removeBounceEffectListener)

			sliderTrack.current.removeEventListener('touchstart', addBounceEffectListener)
			sliderTrack.current.removeEventListener('touchend', removeBounceEffectListener)

			sliderTrack.current.removeEventListener('dblclick', toCheckForResetValue)
			sliderPoint.current.removeEventListener('dblclick', toCheckForResetValue)
		};
	}, [])
			
	return (
		<div ref={sliderWrapper} className="sliderWrapper">
			<div
				className="sliderWrapperInner"
				style={{background: generateBackgroundColorForSliderTrack(relatedValue)}}>
				<div 
					ref={sliderPoint}
					style={
						{
							backgroundColor: generateBackgroundColorForSliderPoint(relatedValue),
							left: offset + 'px'
						}}
					className="sliderPoint" />	
				<div ref={sliderTrack} className="sliderTrack" />
			</div>
		</div>
	)
}


export default Slider

// const areEqual = (prevProps, nextProps) => prevProps.value === nextProps.value


// export default React.memo(Slider,areEqual)