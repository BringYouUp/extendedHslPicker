import React from "react";

import { Spinner } from '@components/index.js'

import './NotFound.sass'

const NotFound = () => {
	return (
		<div className='not-found'>
			<h1>Please, check your internet connection</h1>
			<Spinner />
		</div>
	)
}

export default NotFound