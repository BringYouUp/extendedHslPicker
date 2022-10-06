import React from "react";

import './Form.sass'

import { useDispatch, useSelector } from "react-redux"

import { STARTED_COLLECTION } from '@consts/consts.js'
import { IMG_LOGIN_VIA_GOOGLE } from '@consts/resources.js'

import { auth } from '@/../firebase-config.js'

import { getDataFromLocalStorage } from '@utils/utils.js'

import { createUserWithEmailAndPassword, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

import { Spinner } from '@components/index.js'

const googleProvider = new GoogleAuthProvider();

export default function Form ({ updateLoadingState, setFavoriteColorsList, currentUser, setCurrentUser, setIsAuthOpened, addNewNotification }) {
	const hsl = useSelector(state => state.hsl)
	const dispatch = useDispatch()

	const [isLoading, setIsLoading] = React.useState(false)
	const [response , setResponce] = React.useState(null)

	const [ isFormHasRegisterState, setFormState ] = React.useState(false)

	const formRef = React.useRef(null)

	function getDataFromForm (targetForm) {
		return [ formRef.current.elements.email.value, formRef.current.elements.password.value]
	}

	function authStateHasChanged (user) {
		setIsAuthOpened(false)
	}

	function createNewUser (e) {
		e.preventDefault()
		setIsLoading(true)
		let dataFromForm = getDataFromForm(formRef)
		createUserWithEmailAndPassword(auth, ...dataFromForm)
			.then(userCredential => {
				authStateHasChanged(userCredential.user.uid)
				addNewNotification('successfully create account')
				updateLoadingState(true)
			})
			.catch((error) => {
				const errorCode = error.code
				const errorMessage = error.message
				addNewNotification(error.message, 'error')
			})
			.finally(() => {
				setIsLoading(false)
			})
	}

	function signInUserWithEmailAndPassword (e) {
		e.preventDefault()
		setIsLoading(true)
		
		let dataFromForm = getDataFromForm(formRef)
		let colorGuestMode = getDataFromLocalStorage('hsl')
		let likedListGuestMode = getDataFromLocalStorage('favoriteColorsList')

		signInWithEmailAndPassword(auth, ...dataFromForm)
			.then( userCredential => {
				authStateHasChanged(userCredential.user.uid)
				addNewNotification('successfully logged in')
				updateLoadingState(true)
			})
			.catch( error => {
				const errorCode = error.code
				const errorMessage = error.message
				addNewNotification(error.message, 'error')
			})
			.finally(() => {
				setIsLoading(false)
			})
	}

	function signInViaGoogle (e) {
		e.preventDefault()
		setIsLoading(true)
		signInWithPopup(auth, googleProvider)
			.then((result) => {
				const credential = GoogleAuthProvider.credentialFromResult(result)
				const token = credential.accessToken
				const user = result.user
				authStateHasChanged(user.uid)
				deleteDocFromFirebase(STARTED_COLLECTION, currentUser)
				addNewNotification('successfully logged in via Google')
			})
			.catch((error) => {
				const errorCode = error.code
				const errorMessage = error.message
				// alert(errorMessage)
				const email = error.customData.email
				const credential = GoogleAuthProvider.credentialFromError(error)
				addNewNotification(error.message, 'error')
			})
			.finally(() => {
				setIsLoading(false)
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
					<div>
						<input name="email" type="text" /><label>email</label>
					</div>

					<div>
						<input name="password" type="password" /><label>password</label>
					</div>

					<div>
						{
							!isLoading
							? <input
								type="submit"
								value={`${isFormHasRegisterState ? 'Create User' : 'Log In'}`}
								onClick={(e) => { isFormHasRegisterState ? createNewUser(e) : signInUserWithEmailAndPassword(e) }} />
							: <Spinner />
						}
					</div>
					
					<div className="authOptions">
						<h3>Login via</h3>
						<img
							src={ IMG_LOGIN_VIA_GOOGLE }
							onClick={(e) => { signInViaGoogle(e) }} />
					</div>
				</form>
			</div>
		</div>
	)
}

