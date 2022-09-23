import React from "react";

import { IMG_DOT } from '@consts/resources.js'

const Spinner = () => {
	return (
		<div className='spinner'>
			<img src={IMG_DOT} alt="" />
			<img src={IMG_DOT} alt="" />
			<img src={IMG_DOT} alt="" />
		</div>
	)
}

export default Spinner