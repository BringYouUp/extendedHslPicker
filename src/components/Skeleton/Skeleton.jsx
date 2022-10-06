import React from "react";

import './Skeleton.sass'

const Skeleton = ({ count = 1 }) => {
	
	return (
		<>
			{
				Array(count).fill(null).map((item, index) => <div key={index} className='skeleton'></div>)
			}
		</>
	)
}

export default Skeleton