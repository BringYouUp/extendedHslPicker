import React, { useState, useEffect } from "react";

import { getFormatted } from '@utils/utils.js'

import { useDispatch, useSelector } from "react-redux"

const Board = ({ toUpdateDefaultFormat }) => {
	const store = useSelector(state => state)

	const [ formattedValues, setFormattedValues ] = useState({})
	
	useEffect(() => setFormattedValues(getFormatted(store.hsl)), [store.hsl])


	return (
		<div className="board" style={{backgroundColor: formattedValues.hsl}}>
			{
				['hsl', 'rgb', 'hex'].map(format => {
					return (
						<h2
							key={format}
							style={{'filter': `opacity(${store.hsl.defaultFormatToCopy === format ? 1 : 0.25})`}}
							data-format-to-copy={format}
							onClick={e => toUpdateDefaultFormat(e)}>
							{formattedValues[format]}
						</h2>
					)
				})
			}				
		</div>
	)
}

export default Board