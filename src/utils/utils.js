export const getRandomGeneratedNumber = (min, max) => Math.floor(Math.random() * (max - min) + min)

export const getRandomGeneratedHSL = () => {
	let newHSL = {
		hue: getRandomGeneratedNumber(0, 361),
		saturation: getRandomGeneratedNumber(25, 100),
		lightness: getRandomGeneratedNumber(20, 100),
	}
	return newHSL
}

export function hslToRGB (h, s, l) {
	s /= 100;
	l /= 100;
	const k = n => (n + h / 30) % 12
	const a = s * Math.min(l, 1 - l)
	const f = n =>
		l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)))

	let r = Math.trunc(255 * f(0))
	let g = Math.trunc(255 * f(8))
	let b = Math.trunc(255 * f(4))
  	return [ r, g, b ]
};

export const rgbToHEX = ([red, green, blue]) => [...[red, green, blue].map(item => item < 16 ? '0' + item.toString(16) : item.toString(16))]

export const getFormattedHSL = ({hue, saturation, lightness}) => `hsl(${hue}, ${saturation}%, ${lightness}%)`

export const getFormattedRGB = ([red, green, blue]) => `rgb(${red}, ${green}, ${blue})`

export const getFormattedHEX = ([red, green, blue]) => `#${red}${green}${blue}`.toUpperCase()

export function getFormatted (HSL) {
	let {hue, saturation, lightness } = HSL
	let rgb = hslToRGB(hue, saturation, lightness )
	let hex = rgbToHEX(rgb)

	return {
		hsl: getFormattedHSL(HSL),
		rgb: getFormattedRGB(rgb),
		hex: getFormattedHEX(hex),
	}
}

export function toWriteTextIntoClipboard (textToCopy) {
	console.log(textToCopy)
	return navigator.clipboard.writeText(textToCopy)

}

export async function toReadTextFromClipboard () {
	return await navigator.clipboard.readText()		 
}


export function addStyleProperties (element, properties) {
	for (let property in properties)
		element.style[property] = properties[property]
}

export function removeStyleProperties (element, properties) {
	for (let property of properties)
		element.style.removeProperty(property)
}

export function isTextTheSame (clipboardText, anotherText) {
	return clipboardText === anotherText
}

export function isAddressBarIncludeQuery () {
	return window.location.search
}

export function parseAddressBar() {
	let  paramsQueryObject = {}
	let [ questionMark, ...queryString ] = window.location.search.split('')

	let paramsQueryArray = queryString
		.join('')
		.split(/[=|&&]/)
		.filter(item => item.length);

	['hue', 'saturation', 'lightness'].forEach(item => {
		if (paramsQueryArray.includes(item)) {
			let index = paramsQueryArray.indexOf(item)
			let isNewValueNumber = Number.isInteger(+paramsQueryArray[index + 1])
			let newAppropriateValue = isNewValueNumber ? paramsQueryArray[index + 1] : undefined

			paramsQueryObject[item] = newAppropriateValue
		}
	})

	return paramsQueryObject
}

export function getStartedColorFromAddressBar() {
	let finalParamsObject = {}
	
	let paramsQueryObject = parseAddressBar()

	for (let key in paramsQueryObject)
		if (!finalParamsObject[key] && paramsQueryObject[key])
			finalParamsObject[key] = paramsQueryObject[key]

	return finalParamsObject
}

export function getStartedColorFromLocalStorage() {
	let finalParamsObject = {}
	let stateFromLS = getDataFromLocalStorage('hsl')

	for (let key in stateFromLS)
		if (!finalParamsObject[key] && stateFromLS[key])
			finalParamsObject[key] = stateFromLS[key]

	return finalParamsObject
}

export function getStartedColor () {
	if (isAddressBarIncludeQuery())
		return getStartedColorFromAddressBar()

	if (localStorage.getItem('hsl'))
		return getStartedColorFromLocalStorage()
	
	return null
}

export function getUrlAddress () {
	return window.location.href
}

export function isMobileDevice () {
	return /Android|iPhone/i.test(navigator.userAgent)
}

export function generateBackgroundColorForSliderTrack (relatedValue, hsl) {
	if (relatedValue === 'hue') return `linear-gradient(to right, hsl(0, 100%, 50%), hsl(60, 100%, 50%), hsl(120, 100%, 50%), hsl(180, 100%, 50%), hsl(240, 100%, 50%), hsl(300, 100%, 50%), hsl(360, 100%, 50%))`
	
	let appropriateValue = `hsl(${hsl.hue}, 100%, 50%)`

	if (relatedValue == 'saturation') return `linear-gradient(to right, grey, ${appropriateValue})`
	if (relatedValue === 'lightness') return `linear-gradient(to right, black, ${appropriateValue}, white)`
} 

export function generateBackgroundColorForSliderPoint (relatedValue, hsl) {
	let currentHue = hsl.hue

	if (relatedValue === 'hue') return `hsl(${currentHue}, 100%, 50%)`
	if (relatedValue == 'saturation') return `hsl(${currentHue}, ${hsl[relatedValue]}%, 50%)`
	if (relatedValue === 'lightness') return `hsl(${currentHue}, 100%, ${hsl[relatedValue]}%)`
}

export function setDataIntoLocalStorage (key, data) {
	localStorage.setItem(key, JSON.stringify(data))
}

export function getDataFromLocalStorage (key) {
	
	return JSON.parse(localStorage.getItem(key))
}

export function getGetQuery(actualState) {
	return Object.keys(actualState).map((item, index) =>
		index > 0
			? `&&${item}=${actualState[item]}`
			: `${item}=${actualState[item]}`
	)
	.join('')
}

export function updateUrlAdress (actualState) {
	let newGetQuery = getGetQuery(actualState)
	let baseUrl = window.location.protocol + "//" + window.location.host + window.location.pathname;	
	let newUrl = `${baseUrl}?${newGetQuery}`

	history.replaceState({}, {}, newUrl)
}

export function updateBoardSpanColor (actualState) {
	let newFormattedColor = {...actualState} 

	newFormattedColor.lightness = Number(newFormattedColor.lightness) > 10
		? newFormattedColor.lightness - 10
		: newFormattedColor.lightness + 20

	return getFormattedHSL(newFormattedColor)
}

export function createNotification (message, type = 'message', onAgree) {
	let newNotification = {
		id: Date.now(),
		message: message,
		type: type,
		onAgree,
	}
	return newNotification
}

export function getRefValues (node, params) {
	let returnedValues = []

	for (let parameter of params) {
		let appropriateValue = node.current[parameter]
		returnedValues.push(appropriateValue)
	}

	return returnedValues
}