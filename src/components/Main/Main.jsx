import React from "react";

import { useSelector } from "react-redux"

import { Slider, Board } from '@components/index.js'

export default function Main ({ isLoading, addNewNotification, currentUser, setCurrentUser, sliders }) {
	
	return (
		<div className='main'>
			<Board
				isLoading={isLoading}
				addNewNotification={addNewNotification}
			/>
			{
				isLoading
				? <>
					<div className="skeleton" />
					<div className="skeleton" />
					<div className="skeleton" />
				</>
				: sliders.map(({ relatedValue, setRef, min, max}) => {
					return (
						<Slider
							isLoading={isLoading}
							currentUser={currentUser}
							setCurrentUser={setCurrentUser}
							key={relatedValue}
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

