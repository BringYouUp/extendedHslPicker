import React, { useState, useEffect, useRef, useCallback} from "react";

import { useDispatch, useSelector } from "react-redux"

import { copyClipboardTextToReducer, checkForTheSameUrlInClipboard } from '@store/copiedColorReducer/actions.js'

import { IMG_USERED, IMG_LOGIN_VIA_EMAIL, IMG_LOGIN_VIA_GOOGLE, IMG_LOGOUT, IMG_LOGIN, IMG_USER, IMG_COPIED_URL, IMG_MENU, IMG_HELP, IMG_COPY_COLOR, IMG_COPY_URL, IMG_RANDOM, IMG_ADD, IMG_ADDED, IMG_LIST } from '@/resources.js'

import { app, db, auth } from '@/../firebase-config.js'

import { deleteDocFromFirebase } from '@utils/firestoreUtils.js'

import { signOut, getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

const googleProvider = new GoogleAuthProvider();

import { STARTED_COLLECTION } from '@/consts.js'

export default function Form ({ currentUser, setCurrentUser, setIsAuthOpened }) {
	const hsl = useSelector(state => state.hsl)

	const [ isFormHasRegisterState, setFormState ] = useState(false)

	const formRef = React.useRef(null)

	function getDataFromForm (targetForm) {
		return [ formRef.current.elements.email.value, formRef.current.elements.password.value]
	}

	function authStateHasChanged (user) {
		deleteDocFromFirebase(STARTED_COLLECTION, currentUser)
		setCurrentUser(user)
		setIsAuthOpened(false)
	}

	function signInUserWithEmailAndPassword (e) {
		e.preventDefault()
		let dataFromForm = getDataFromForm(formRef)
		signInWithEmailAndPassword(auth, ...dataFromForm)
			.then( userCredential => authStateHasChanged(userCredential.user.uid))
			.catch( error => {
				const errorCode = error.code
				const errorMessage = error.message
				alert(errorMessage)
		})
	}

	function createNewUser (e) {
		e.preventDefault()
		let dataFromForm = getDataFromForm(formRef)
		createUserWithEmailAndPassword(auth, ...dataFromForm)
			.then(userCredential => authStateHasChanged(userCredential.user.uid))
			.catch((error) => {
				const errorCode = error.code
				const errorMessage = error.message
				alert(errorMessage)
		})
	}

	function signInViaGoogle (e) {
		e.preventDefault()
		signInWithPopup(auth, googleProvider)
			.then((result) => {
				const credential = GoogleAuthProvider.credentialFromResult(result)
				const token = credential.accessToken
				const user = result.user
				// console.log(result)

				authStateHasChanged(user.uid)
			})
			.catch((error) => {
				const errorCode = error.code
				const errorMessage = error.message
				alert(errorMessage)
				const email = error.customData.email
				const credential = GoogleAuthProvider.credentialFromError(error)
			})
	}

	return (
		<div className="authFormWrapper">
			<div className="authForm">
				<div className="formTitle">
					<h2
						style={{ filter: `${isFormHasRegisterState ? 'opacity(0.25)' : 'opacity(1)'}` }}
						onClick={() => { setFormState(false) }}>
						Log in
					</h2>

					<h2
						style={{ filter: `${isFormHasRegisterState ? 'opacity(1)' : 'opacity(0.25)'}` }}
						onClick={() => { setFormState(true) }}>
						Sign Up
					</h2>
				</div>
				
				<form ref={formRef}>
					<div className="inputEmailWrapper">
						<input name="email" type="text" /><label>email</label>
					</div>

					<div className="inputPasswordWrapper">
						<input name="password" type="password" /><label>password</label>
					</div>
					
					<input
						type="submit"
						value={`${isFormHasRegisterState ? 'Create User' : 'Log In'}`}
						onClick={(e) => { isFormHasRegisterState ? createNewUser(e) : signInUserWithEmailAndPassword(e) }} />
					
					<h3>Login via</h3>

					<div className="authOptions">
						<img
							src={ IMG_LOGIN_VIA_GOOGLE }
							onClick={(e) => { signInViaGoogle(e) }} />
						
					</div>

				</form>
			</div>
		</div>
	)
}

