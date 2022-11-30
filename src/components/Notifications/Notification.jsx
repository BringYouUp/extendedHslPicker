import React from "react"

import "./Notifications.sass"

import { IMG_ADDED, IMG_CROSS } from "@consts/resources.js"

export default function Notification ({ message, messageID, removeNotification, type, onAgree }) {
	const [ isVisible, updateVisible ] = React.useState(true)

	React.useEffect(() => {
		let toUnvisible = null
		
		toUnvisible = setTimeout(() => { updateVisible(false) }, 5000)

		return () => { clearTimeout(toUnvisible) }
	}, [])

	return isVisible &&
		<div className="notification">
				<div className="notificationType">
					<span className={type} />
				</div>

				<div className="notificationMessage">
					<span>{ message }</span>
				</div>

				<div className="notificationButtons">
					{ type === "action" &&
						<img
							onClick={() => {
								onAgree()
								removeNotification(messageID)
							}}
							src={IMG_ADDED} />
					}
						<img src={IMG_CROSS} className="close" onClick={() => {removeNotification(messageID)}} />
				</div>
		</div>
}