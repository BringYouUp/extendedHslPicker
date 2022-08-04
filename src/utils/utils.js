import { LS_MAIN_KEY, MAIN_FORMATS } from '@/consts.js'

const getRandomGeneratedNumber = (max, min = 0) => Math.floor(Math.random() * (max - min) + min)

function hslToRGB (h, s, l) {
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

const rgbToHEX = ([red, green, blue]) => [...[red, green, blue].map(item => item < 16 ? '0' + item.toString(16) : item.toString(16))]

const getFormattedHSL = ({hue, saturation, lightness}) => `hsl(${hue}, ${saturation}%, ${lightness}%)`

const getFormattedRGB = ([red, green, blue]) => `rgb(${red}, ${green}, ${blue})`

const getFormattedHEX = ([red, green, blue]) => `#${red}${green}${blue}`.toUpperCase()

function getFormatted (HSL) {
	let {hue, saturation, lightness } = HSL
	let rgb = hslToRGB(hue, saturation, lightness )
	let hex = rgbToHEX(rgb)

	return {
		hsl: getFormattedHSL(HSL),
		rgb: getFormattedRGB(rgb),
		hex: getFormattedHEX(hex),
	}
}

function toCopyColorInClipboard (textToCopy) {
	// debugger
	console.log('tocopycolor')
	navigator.clipboard
		.writeText(textToCopy)
		.then(() => {})
		.catch(err => {})
}

function addListeners (element, listeners) {
	for (let listener in listeners)
		element.addEventListener(listener, listeners[listener])
}

function removeListeners (element, listeners) {
	for (let listener in listeners)
		element.removeEventListener(listener, listeners[listener])
}

function addStyleProperties (element, properties) {
	for (let property in properties)
		element.style[property] = properties[property]
}

function removeStyleProperties (element, properties) {
	for (let property of properties)
		element.style.removeProperty(property)
}

function isTextTheSame (clipboardText, actualFormattedValues, defaultFormatToCopy) {
	// let isOneTheSame = MAIN_FORMATS.some(item => clipboardText === actualFormattedValues[item])

	return clipboardText === actualFormattedValues[defaultFormatToCopy]
}

function isAddressBarIncludeQuery () {
	return window.location.search
}

function parseAddressBar() {
	let  paramsQueryObject = {}
	let [ questionMark, ...queryString ] = window.location.search.split('')

	let paramsQueryArray = queryString
		.join('')
		.split(/[=|&&]/)
		.filter(item => item.length);

	['hue', 'saturation', 'lightness'].forEach(item => {
		if (paramsQueryArray.includes(item)) {
			let index = paramsQueryArray.indexOf(item)
			let isNewValueIsNumber = Number.isInteger(+paramsQueryArray[index + 1])
			let newAppropriateValue = isNewValueIsNumber ? paramsQueryArray[index + 1] : undefined

			paramsQueryObject[item] = newAppropriateValue
		}
	})

	return paramsQueryObject
}

function getInitialParams () {
	let finalParamsObject = {}

	if (isAddressBarIncludeQuery()) {
		let paramsQueryObject = parseAddressBar()

		for (let key in paramsQueryObject)
			if (!finalParamsObject[key] && paramsQueryObject[key])
				finalParamsObject[key] = paramsQueryObject[key]
	}

	if (localStorage.getItem('state')) {
		let stateFromLS = JSON.parse(localStorage.getItem('state'))

		for (let key in stateFromLS)
			if (!finalParamsObject[key] && stateFromLS[key])
				finalParamsObject[key] = stateFromLS[key]
	}

	return finalParamsObject
}

export { getInitialParams, parseAddressBar, isTextTheSame, getRandomGeneratedNumber, getFormatted, toCopyColorInClipboard, getFormattedHSL, addListeners, removeListeners, addStyleProperties, removeStyleProperties }