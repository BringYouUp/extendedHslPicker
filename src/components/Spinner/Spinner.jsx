import React from "react"

import "./Spinner.sass"

import { IMG_DOT } from "@consts/resources.js"

export default function Spinner () {
	return (
		<div className="spinner">
			<img src={IMG_DOT} alt="spinner-dot" />
			<img src={IMG_DOT} alt="spinner-dot" />
			<img src={IMG_DOT} alt="spinner-dot" />
		</div>
	)
}