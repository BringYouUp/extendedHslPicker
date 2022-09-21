import React from "react";

import { useSelector } from "react-redux"

import { Slider, Board } from '@components/index.js'

export default function Main ({ isLoading, addNewNotification, currentUser, setCurrentUser, sliders , oneTimeChanged }) {
	const hsl = useSelector(state => state.hsl)
	
	return (
		<div className='main'>
			<Board
				isLoading={isLoading}
				addNewNotification={addNewNotification}
			/>
			{
				isLoading
				? <>
					{ Array(3).fill(<div className="skeleton" />).map(item => item) }
				</>
				: sliders.map(({ relatedValue, setRef, min, max}) => {
					return (
						<Slider
							isLoading={isLoading}
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

