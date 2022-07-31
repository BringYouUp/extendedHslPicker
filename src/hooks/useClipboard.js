import React, { useState, useEffect, } from "react";

const useLocalStorage = (key, initialKeyState) => {
	const [ value, setState ] = useState ( () => JSON.parse(localStorage.getItem(key)) || initialKeyState)

	useEffect(() => localStorage.setItem(key, JSON.stringify(value)), [value])

	return [ value, setState ]
}

export default useLocalStorage