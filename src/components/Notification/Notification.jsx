import React from "react";

import { useSelector } from "react-redux"

import { Slider, Board } from '@components/index.js'

export default function Notification () {
	const hsl = useSelector(state => state.hsl)
	
	const [ isVisible, updateVisible ] = React.useState(true)

	React.useEffect(() => {
		
	}, [])

	return (
		<div
			style={{
				display: `${isVisible ? 'block' : 'none'}`
			}} 
			className='notification'
		>
			
			Pop Up
		</div>
	)
}

function Buttons () {
	return (
		<>
			<button type="button"></button>
			<button type="button"></button>
		</>
	)
}

