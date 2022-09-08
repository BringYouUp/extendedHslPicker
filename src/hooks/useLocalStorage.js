import React, { useState, useEffect, } from "react";

import { getCollectionFromFireStore, getDataFromFireStore, getStartedDataFromFirestore, updateFirestore } from '@/utils/firestoreUtils.js'

const useLocalStorage = (key, initialKeyState) => {
	const [ value, setState ] = useState (() => {

		

		// getStartedDataFromFirestore(['Admin'], key).then(data => {console.log(key, data)})
			
		// getStartedDataFromFirestore('Admin')
			// .then(data => {

				// return data.data().key || JSON.parse(localStorage.getItem(key)) || initialKeyState
			// } )

		return JSON.parse(localStorage.getItem(key)) || initialKeyState
	})

	useEffect(() => {
		// localStorage.setItem(key, JSON.stringify(value))
		// updateFirestore(key, value, 'users', 'Admin')

	}, [value])

	return [ value, setState ]
}

export default useLocalStorage