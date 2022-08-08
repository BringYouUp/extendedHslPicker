export const getRandomGeneratedNumber = (max, min = 0) => Math.floor(Math.random() * (max - min) + min)

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

export function toCopyColorToClipboard (textToCopy) {
	navigator.clipboard
		.writeText(textToCopy)
		.then(() => {})
		.catch(err => {})
}

export function addListeners (element = document, listeners) {
	for (let listener in listeners)
		element.addEventListener(listener, listeners[listener])
}

export function removeListeners (element = document, listeners) {
	for (let listener in listeners)
		element.removeEventListener(listener, listeners[listener])
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
			let isNewValueIsNumber = Number.isInteger(+paramsQueryArray[index + 1])
			let newAppropriateValue = isNewValueIsNumber ? paramsQueryArray[index + 1] : undefined

			paramsQueryObject[item] = newAppropriateValue
		}
	})

	return paramsQueryObject
}

export function getInitialParams () {
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

export function getUrlAddress () {
	return window.location.href
}