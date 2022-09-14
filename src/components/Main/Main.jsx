import React from "react";

import { useSelector } from "react-redux"

import { Slider, Board } from '@components/index.js'

export default function Main ({ addNewNotification, currentUser, setCurrentUser, sliders , oneTimeChanged }) {
	const hsl = useSelector(state => state.hsl)
	
	return (
		<div className='main'>
			<Board addNewNotification={addNewNotification} />
			{
				sliders.map(({ relatedValue, setRef, min, max}) => {
					return (
						<Slider
							currentUser={currentUser}
							setCurrentUser={setCurrentUser}
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

