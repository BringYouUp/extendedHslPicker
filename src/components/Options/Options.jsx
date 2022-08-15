import React, { useState, useEffect, useRef } from "react";

import { useDispatch, useSelector } from "react-redux"

import useLocalStorage from '@hooks/useLocalStorage.js'

import { addStyleProperties, removeStyleProperties, isMobileDevice, getFormattedHSL, getUrlAddress, toWriteTextIntoClipboard} from '@utils/utils.js'
import { selectHSL, getRandomColor, getNewDefaultColorToCopy } from '@store/hslReducer/actions.js'

import { copyClipboardTextToReducer, checkForTheSameUrlInClipboard } from '@store/copiedColorReducer/actions.js'

import { IMG_COPIED_URL, IMG_MENU, IMG_BACK, IMG_HELP, IMG_COPY_COLOR, IMG_COPY_URL, IMG_RANDOM, IMG_ADD, IMG_ADDED, IMG_LIST } from '@/resources.js'


export default function Options ({ relatedValue, setRef, toResetValue, min, max, value }) {
	const dispatch = useDispatch()
	
	const hsl = useSelector(state => state.hsl)
	const copiedColorReducer = useSelector(state => state.copiedColorReducer)

	const [ isUniqueColor, setIsUniqueColor ] = useState(true)
	const [ isOpenedList, setIsOpenedList ] = useState(false)
	const [ isMenuOpened, setIsMenuOpened ] = useState(true)

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

		toWriteTextIntoClipboard(urlAddress)
		dispatch(copyClipboardTextToReducer(urlAddress))
	}

	useEffect(() => {
		let urlAddress = getUrlAddress()
		
		dispatch(checkForTheSameUrlInClipboard(copiedColorReducer.textFromClipboard, urlAddress))
	}, [ copiedColorReducer.hsl, copiedColorReducer.textFromClipboard, hsl.defaultFormatToCopy])

	useEffect(() => { setIsUniqueColor(isUnique()) }, [hsl, favoritesLS])
	
	return (
		<div className={`footer`}>
			{
				!isMobileDevice() &&
				<img
					src={IMG_MENU}
					onClick={() => { setIsMenuOpened(prev => !prev) }}
					alt="Menu" 
					style={{
						'transform': `${isMenuOpened ? 'rotate(90deg)' : 'rotate(0deg)'}`
					}}/>
			}
			{
				isMenuOpened &&
				<>
					<img
						src={ IMG_BACK }
						onClick={() => { window.location.href = "about:home" }}
						alt="Back" />
						
					<img
						src={ IMG_HELP }
						alt="Help Station" />

					<img
						src={ copiedColorReducer.isTheSameUrlInClipboard ? IMG_COPIED_URL : IMG_COPY_URL }
						onClick={() => { toCopyUrlIntoClipboard() }}
						alt="Copy URL" />

					<img
						onClick={() => dispatch(getRandomColor())}
						data-name="random"
						src={IMG_RANDOM}
						alt="Random Color" />

					<img
						onClick={() => {isUniqueColor ? toAddToFavorite() : toRemoveFromFavorite()}}
						src={isUniqueColor ? IMG_ADD : IMG_ADDED}
						alt="Add to Favorite" />
				</>
			}

			<img
				onClick={() => { setIsOpenedList(prev => !prev)}}
				src={ IMG_LIST }
				alt="Show / Hide Favorite List"
				style={{
					'transform': `${isOpenedList
						? 'rotate(0deg)'
						: 'rotate(-90deg)'}`					
				}} />
			
			{ isOpenedList &&
				<div className={`favoriteCellList`}>
					{
						favoritesLS.map(item => {
							return (
								<div
									key={item.id}
									className="favoriteCell"
									style={{
										backgroundColor: getFormattedHSL(item)
									}}
									onClick={() => dispatch(selectHSL(item))} /> 
							)
						})
					}
				</div>
			}
		</div>

	)
}