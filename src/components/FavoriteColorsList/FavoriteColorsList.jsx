import React, { useState, useEffect, useRef } from "react";

import { useDispatch, useSelector } from "react-redux"

const Slider = ({ relatedValue, setRef, toResetValue, min, max, value }) => {
	
	const store = useSelector(state => state)
	const dispatch = useDispatch()

	const sliderWrapper = useRef(null)
	const sliderTrack = useRef(null)
	const sliderPoint = useRef(null)

	const [ offset, setOffset ] = useState(0)

	const mouseMoveEvent = (e) => e.target == sliderTrack.current && addBounceEffect(e)	

	const removeBounceEffect = () => {
		sliderPoint.current.style.removeProperty('top')
		sliderPoint.current.style.removeProperty('transform')
	}

	const addBounceEffectListener = (e) => {
		sliderTrack.current.addEventListener('mousemove', mouseMoveEvent)
		addBounceEffect(e)
	}

	const removeBounceEffectListener = e => {
		sliderTrack.current.removeEventListener('mousemove', mouseMoveEvent)
		removeBounceEffect()
	}

	const addBounceEffect = (e) => {
		let eOffset = e.offsetX + 1
		let sliderTrackWidth = sliderTrack.current.offsetWidth


		if (eOffset < 0 || eOffset > sliderTrackWidth) return

		// if (eOffset < 0) eOffset = 0
		// if (eOffset > sliderTrackWidth) eOffset = sliderTrackWidth

		let progress = Math.trunc(parseInt(eOffset) * 100 / sliderTrackWidth)
		let newValue = Math.trunc(progress / 100 * max )

		sliderPoint.current.style.top = '-2rem'
		sliderPoint.current.style.transform = 'scale(1.5)'


		setRef(newValue)
	}

	useEffect(() => {
		// console.log(relatedValue, value)
		setOffset(prev => sliderTrack.current.offsetWidth * (store.hsl[relatedValue] / max) - 8)
	}, [ value ])

	useEffect(() => {
		sliderWrapper.current.addEventListener('mouseleave', removeBounceEffectListener)
		sliderTrack.current.addEventListener('mouseup', removeBounceEffectListener)
		sliderTrack.current.addEventListener('mousedown', addBounceEffectListener)
		sliderTrack.current.addEventListener('dblclick', toResetValue)
		sliderPoint.current.addEventListener('dblclick', toResetValue)

		return () => {
			sliderWrapper.current.removeEventListener('mouseleave', removeBounceEffectListener)
			sliderTrack.current.removeEventListener('mousedown', addBounceEffectListener)
			sliderTrack.current.removeEventListener('mouseup', removeBounceEffectListener)
			sliderTrack.current.removeEventListener('dblclick', toResetValue)
			sliderPoint.current.removeEventListener('dblclick', toResetValue)
		};
	}, [])
			
	return (
		<div ref={sliderWrapper} className="sliderWrapper">
			<div className="sliderWrapperInner">
				<div 
					ref={sliderPoint}
					style={
						{
							backgroundColor: store.copiedColorReducer.hsl,
							left: offset + 'px'
						}}
					className="sliderPoint" />	
				<div ref={sliderTrack} className="sliderTrack" />
			</div>
		</div>
	)
}

export default Slider