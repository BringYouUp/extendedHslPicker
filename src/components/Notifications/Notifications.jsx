import React from "react"

import "./Notifications.sass"

import { Notification } from "@components/index.js"

function Notifications ({ notifications, removeNotification }) {
	return (
		<div className="notifications">
			{ notifications.map(notification => {
				return ( <Notification
					key={notification.id}
					message={notification.message}
					messageID={notification.id}
					removeNotification={removeNotification}
					type={notification.type}
					onAgree={notification.onAgree} />)
				})
			}
		</div>
	)
}

function isComponentNeedRerender (prevProps, nextProps) {
	let isShouldComponentUpdate = null

	if (prevProps.notifications.length !== nextProps.notifications.length)
		isShouldComponentUpdate = true
	else
		isShouldComponentUpdate = false

	return !isShouldComponentUpdate
}

export default React.memo(Notifications, isComponentNeedRerender)