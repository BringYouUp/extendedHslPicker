const getRandomGeneratedNumber = (max, min = 0) => Math.floor(Math.random() * (max - min) + min)


const hslToRGBA = (h, s, l, al) => {
	s /= 100;
	l /= 100;
	const k = n => (n + h / 30) % 12
	const a = s * Math.min(l, 1 - l)
	const f = n =>
		l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)))

	let r = Math.trunc(255 * f(0))
	let g = Math.trunc(255 * f(8))
	let b = Math.trunc(255 * f(4))
  	return [ r, g, b, +al]
};

const rgbaToHEXA = ([red, green, blue, alpha]) => [...[red, green, blue].map(item => item > 16 ? item.toString(16) : '0' + item.toString(16)), Math.trunc((alpha * 100)).toString(16)]

const getFormattedHSLA = (hue, saturation, lightness, alpha) => `hsla(${hue}, ${saturation}%, ${lightness}%, ${alpha})`

const getFormattedRGBA = ([red, green, blue, alpha]) => `rgba(${red}, ${green}, ${blue}, ${alpha})`

const getFormattedHEXA = ([red, green, blue, alpha]) =>  `#${red}${green}${blue}${alpha}`

const getFormatted = ({hue, saturation, lightness, alpha}) => {
	let rgba = hslToRGBA(hue, saturation, lightness, alpha)
	let hexa = rgbaToHEXA(rgba)

	return {
		hsla: getFormattedHSLA(hue, saturation, lightness, alpha),
		rgba: getFormattedRGBA(rgba),
		hexa: getFormattedHEXA(hexa),
	}
}

function toCopyColor (textToCopy) {
	navigator.clipboard.writeText(textToCopy)
		.then(() => {})
		.catch(err => {})
}

export { getRandomGeneratedNumber, getFormatted, toCopyColor }