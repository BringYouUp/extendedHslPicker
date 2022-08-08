import React, { useState, useEffect, useRef } from "react";

import { useDispatch, useSelector } from "react-redux"

import useLocalStorage from '@hooks/useLocalStorage.js'

import { getFormattedHSL, getUrlAddress, toCopyColorToClipboard} from '@utils/utils.js'
import { selectHSL, getRandomColor, getNewDefaultColorToCopy } from '@store/hslReducer/actions.js'

import { copyClipboardTextToReducer, checkForTheSameTextInClipboard, checkForTheSameUrlInClipboard } from '@store/copiedColorReducer/actions.js'

import { IMG_COPIED_URL, IMG_MENU, IMG_BACK, IMG_HELP, IMG_COPY_COLOR, IMG_COPY_URL, IMG_RANDOM, IMG_ADD, IMG_ADDED, IMG_OPENED_LIST, IMG_CLOSED_LIST } from '@/resources.js'


export default function Options ({ relatedValue, setRef, toResetValue, min, max, value }) {
	const dispatch = useDispatch()
	
	const hsl = useSelector(state => state.hsl)
	const copiedColorReducer = useSelector(state => state.copiedColorReducer)

	const [ isUniqueColor, setIsUniqueColor ] = useState(true)
	const [ isOpenedList, setIsOpenedList ] = useState(true)
	const [ isMenuOpened, setIsMenuOpened ] = useState(false)

	const [ favoritesLS, setFavoritesLS ] = useLocalStorage('favoriteColorsList', [])

	function isUnique () {
		let formattedNewColorHSLA = getFormattedHSL(hsl)
		let isNewColorUnique = favoritesLS.every(item => getFormattedHSL(item) !== formattedNewColorHSLA)

		return isNewColorUnique
	}

	function toAddToFavorite () {
			if (!isUnique()) return

			let { hue, saturation, lightness } = hsl

			setFavoritesLS(prev => [ { hue, saturation, lightness, id: Date.now() }, ...prev])
		}
	function toRemoveFromFavorite () {
			let newFavorites = favoritesLS.filter(item => item.hue !== hsl.hue)

			setFavoritesLS(prev => [...newFavorites])
		}

	function toCopyUrlIntoClipboard () {
		let urlAddress = getUrlAddress()

		dispatch(copyClipboardTextToReducer(urlAddress))
	}

	useEffect(() => {
		let urlAddress = getUrlAddress()
		
		toCopyColorToClipboard(urlAddress)
		dispatch(checkForTheSameUrlInClipboard(copiedColorReducer.textFromClipboard, urlAddress))
	}, [ copiedColorReducer.hsl, copiedColorReducer.textFromClipboard, hsl.defaultFormatToCopy])

	useEffect(() => { setIsUniqueColor(isUnique()) }, [hsl, favoritesLS])
	
	return (
		<div className='footer'>
			<img
				src={IMG_MENU}
				onClick={() => { setIsMenuOpened(prev => !prev) }}
				alt="" 
				style={{
					'transform': `${isMenuOpened ? 'rotate(90deg)' : 'rotate(0deg)'}`
				}}/>
			{
				isMenuOpened &&
				<>
					<img
						src={ IMG_BACK }
						onClick={() => { window.location.href = "about:home" }}
						alt="" />
						
					<img src={ IMG_HELP } alt="" />

					<img
						src={ copiedColorReducer.isTheSameUrlInClipboard ? IMG_COPIED_URL : IMG_COPY_URL }
						onClick={() => { toCopyUrlIntoClipboard() }}
						alt="" />

					<img
						onClick={() => dispatch(getRandomColor())}
						src={IMG_RANDOM}
						alt="" />

					<img
						onClick={() => {isUniqueColor ? toAddToFavorite() : toRemoveFromFavorite()}}
						src={isUniqueColor ? IMG_ADD : IMG_ADDED}
						alt="" />
				</>
			}

			<img
				onClick={() => { setIsOpenedList(prev => !prev)}}
				src={ IMG_CLOSED_LIST }
				alt=""
				style={{
					'transform': `${isOpenedList ? 'rotate(360deg)' : 'rotate(180deg)'}`
				}}/>
			
			<div className='favoriteCellList'>
				{ isOpenedList &&
					favoritesLS.map(item => {
						return (
							<div
								key={item.id}
								className="favoriteCell"
								style={
									{
										backgroundColor: getFormattedHSL(item)
									}
								}
								onClick={() => dispatch(selectHSL(item))} /> 
						)
					})
				}
			</div>
		</div>

	)
}