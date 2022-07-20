const getRandomGeneratedNumber = (max, min = 0) => Math.floor(Math.random() * (max - min) + min)

const hslToRGB = (h, s, l) => {
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

const rgbaToHEX = ([red, green, blue]) => [...[red, green, blue].map(item => item > 16 ? item.toString(16) : '0' + item.toString(16))]

const getFormattedHSL = ({hue, saturation, lightness}) => `hsl(${hue}, ${saturation}%, ${lightness}%)`

const getFormattedRGB = ([red, green, blue]) => `rgb(${red}, ${green}, ${blue})`

const getFormattedHEX = ([red, green, blue]) => `#${red}${green}${blue}`.toUpperCase()

const getFormatted = (HSL) => {
	let {hue, saturation, lightness } = HSL
	let rgb = hslToRGB(hue, saturation, lightness )
	let hex = rgbaToHEX(rgb)

	return {
		hsl: getFormattedHSL(HSL),
		rgb: getFormattedRGB(rgb),
		hex: getFormattedHEX(hex),
	}
}

function toCopyColor (textToCopy) {
	// debugger
	// console.log('copying................')
	navigator.clipboard.writeText(textToCopy)
		.then(() => {})
		.catch(err => {})
}


export { getRandomGeneratedNumber, getFormatted, toCopyColor, getFormattedHSL }