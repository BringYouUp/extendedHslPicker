import React, { useState } from "react";

import { createStore, useSelector } from "react-redux"

import { Slider, Board } from '@components/index.js'

export default function Main ({ sliders , oneTimeChanged }) {
	const hsl = useSelector(state => state.hsl)
	
	return (
		<div className='main'>
			<Board />
			{
				sliders.map(({ relatedValue, setRef, min, max}) => {
					return (
						<Slider 
							key={relatedValue}
							oneTimeChanged={oneTimeChanged}
							relatedValue={relatedValue}
							setRef={setRef}
							min={min}
							max={max}
						/>
					)
				})
			}
		</div>
	)
}

