import { doc, deleteDoc, updateDoc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';

import { INITIAL_FIRESTORE_STATE, LS_MAIN_KEY, INITIAL_HUE, INITIAL_SATURATION, INITIAL_LIGHTNESS } from '@consts/consts.js'

import { app, db } from '@/../firebase-config.js'

export async function getDocFromFirestore (...path) {
	const docRef = await doc(db, ...path)
	const docSnap = await getDoc(docRef)
	return docSnap
}

export function isDocExists (doc) {
	return doc.exists()
}

export function extractDataFromDoc (doc) {
	return doc.data()
}

export async function setDataIntoFireStore (data, ...path) {
	await setDoc(doc(db, ...path), data)
}

export async function getCollectionFromFireStore(...path) {
	let doc = await getDocFromFirestore(...path)

	if (isDocExists(doc)) return extractDataFromDoc(doc)
	await setDataIntoFireStore(INITIAL_FIRESTORE_STATE, ...path)
	doc = await getDocFromFirestore(...path)
	return extractDataFromDoc(doc)
}

export async function getDataFromFireStore(collectionObject, key) {
	return collectionObject[key]
}

export function updateFirestore(key, actualData, ...path) {
	const docRef = doc(db, ...path);
	updateDoc(docRef, {
		[key]: actualData
	})
}
