import React from 'react';

const getWidth = () => window.innerWidth
	|| document.documentElement.clientWidth
	|| document.body.clientWidth

const getHeight = () => window.innerHeight 
	|| document.documentElement.clientHeight 
	|| document.body.clientHeight

export default function useResize() {
	let [width, setWidth] = React.useState(getWidth())
	let [height, setHeight] = React.useState(getHeight())

	React.useEffect(() => {
		let timeoutId = null

		const resizeListener = () => {
			clearTimeout(timeoutId)
			timeoutId = setTimeout(() => {
				setWidth(getWidth())
				setHeight(getHeight())
			}, 250)
		}

		window.addEventListener('resize', resizeListener)

		return () => {
			window.removeEventListener('resize', resizeListener)
		}
	}, [])

  return width > height ? height * 0.45 : width * 0.45
}