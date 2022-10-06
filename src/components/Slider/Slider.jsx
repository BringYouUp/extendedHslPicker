import React from "react";

import './Slider.sass'

import { getRefValues, addStyleProperties , removeStyleProperties,  generateBackgroundColorForSliderPoint , generateBackgroundColorForSliderTrack } from '@utils/utils.js'

import { useDispatch, useSelector } from "react-redux"

import { resetValueOfHSL } from '@store/hslReducer/actions.js'

import { updateFirestore } from '@utils/firestoreUtils.js'

import { STARTED_COLLECTION } from '@consts/consts.js'

import { selectHSL } from '@store/hslReducer/actions.js'

import useResize from '@/hooks/useResize.js'

export default function Slider ({ currentUser, relatedValue, max }) {
	const dispatch = useDispatch()
	const hsl = useSelector(state => state.hsl)

	const sliderWrapper = React.useRef(null)
	const sliderTrack = React.useRef(null)
	const sliderPoint = React.useRef(null)

	const currentSliderWidth = useResize()

	const [ offset, setOffset ] = React.useState(() => currentSliderWidth * hsl[relatedValue] / max)

	function removeBounceEffectListener (e) {
		removeStyleProperties(sliderPoint.current, ['top', 'transform'])
		updateFirestore('hsl', hsl, STARTED_COLLECTION, currentUser)
	}

	function addBounceEffect (e) {
		if (e.type === 'mousemove' && e.nativeEvent.which !== 1) return

		let [ startSliderTrack ] = getRefValues(sliderTrack, ['offsetLeft'])
		let clickOffset = 0

		addStyleProperties(sliderPoint.current, {
			top: '-2.5rem',
			transform: 'scale(2)'
		})

		if (e.type === 'touchmove' || e.type === 'touchstart') {
			clickOffset = e.touches[0]?.pageX - startSliderTrack
		}

		if (e.type === 'mousemove' || e.type === 'mousedown') {
			clickOffset = e.pageX - startSliderTrack
		}

		if (clickOffset < 0 || clickOffset > currentSliderWidth) return

		let progress = clickOffset * 100 / currentSliderWidth
		let newValue = progress / 100 * max 

		updateOffset(newValue)
	}

	function oneTimeChanged (e) {
		let [ startSliderTrack ] = getRefValues(sliderTrack, ['offsetLeft'])
		let clickOffset = e.pageX

		if (clickOffset > startSliderTrack && clickOffset < startSliderTrack + currentSliderWidth) return

		let isClickOnTheLeft = clickOffset < startSliderTrack
		if (hsl[relatedValue] <= 0 && isClickOnTheLeft) return
		if (hsl[relatedValue] >= max && !isClickOnTheLeft) return

		let toAdd = isClickOnTheLeft ? -1 : 1

		let newState = { ...hsl, [relatedValue]: hsl[relatedValue] + toAdd}

		updateOffset(hsl[relatedValue] + toAdd)
		updateFirestore('hsl', newState, STARTED_COLLECTION, currentUser)
	}

	function toCheckForResetValue (e) {
		let [ startSliderTrack ] = getRefValues(sliderTrack, ['offsetLeft'])

		let clickOffset = e.pageX
		let isClickWithinSlider = clickOffset > startSliderTrack && clickOffset < currentSliderWidth + startSliderTrack

		if (isClickWithinSlider) {
			dispatch(resetValueOfHSL(relatedValue))
		}
	}

	function updateOffset (colorValue) {
		let newOffset = currentSliderWidth * (colorValue / max)
		setOffset(newOffset)
	}

	React.useEffect(() => {
		let newRelatedValue = Math.floor((offset / currentSliderWidth) * max)
		dispatch(selectHSL({...hsl, [relatedValue]: newRelatedValue }))
	}, [offset])

	React.useEffect(() => {
		updateOffset(hsl[relatedValue])
	}, [hsl[relatedValue], currentSliderWidth])

	return (
		<div
			ref={sliderWrapper}
			className="sliderWrapper"
			onMouseDown={addBounceEffect}
			onMouseUp={removeBounceEffectListener}
			onTouchStart={addBounceEffect}
			onTouchEnd={removeBounceEffectListener}
			onMouseMove={addBounceEffect}
			onTouchMove={addBounceEffect}
			onMouseLeave={removeBounceEffectListener}
		>
			<div
				className='sliderWrapperInner'
				style={
					{
						background: generateBackgroundColorForSliderTrack(relatedValue, hsl)
					}}
				onClick={(e) => { oneTimeChanged(e)}}
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
								left: offset - 6 + 'px'
							}}
						className='sliderPoint'
						onDoubleClick={toCheckForResetValue} 
					/>	
				</div>
			</div>
		</div>
	)
}
