import React from "react";

import { useSelector } from "react-redux"

import { Slider, Board } from '@components/index.js'

import { IMG_ADDED, IMG_CROSS } from '@/resources.js'


export default function Notification ({ title, message, messageID, removeNotification, type, onAgree, onDisagree }) {
	const hsl = useSelector(state => state.hsl)
	
	const [ isVisible, updateVisible ] = React.useState(true)

	React.useEffect(() => {
		// let zzz = setTimeout(() => {
		// 	removeNotification(messageID)
		// }, 5000)
		// console.log(zzz)

		return () => {
			// console.log(zzz)
			// clearTimeout(zzz)
		}
	}, [])

	return (
		<div className='notification'>
			<div className="notificationHeader">
				<div className="notificationType">
					<span className={type} />
				</div>

				<div className="notificationMessage">
					<span>{ message }</span>
				</div>

				<div className="notificationButtons">
					{
						type === 'action' && <img
							onClick={onAgree}
							src={IMG_ADDED} />
					}
						<img src={IMG_CROSS} className="close" onClick={() => {removeNotification(messageID)}} />
				</div>

			</div>
		</div>
	)
}