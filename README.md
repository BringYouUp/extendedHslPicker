https://extended-hsl-picker.web.app/

--- VER. 0.4.3 ---

	** COMMON
		- added handlers for 'Space' and 'Enter' pressing
		- added handler for precise adjustment color by clicking on the right or left of the slider 
	** STYLE
		- updated skeleton styles (colors and duration)
		- added favicon
		- restyled title fomt-size
	** FIXED
		- all operation with clipboard hanle only if document.hasFocus()
	** MINOR
		- rethinking project folders structure and some files

--- VER. 0.4.2 ---

	** COMMON
		- added component NOTIFICATION with next type: action
	** STYLE
		- added skeleton animation

--- VER. 0.4.1 ---

	** COMMON
		- added component NOTIFICATION with next types: message, error
		- added component SPINNER
		- some code optimization related to application perfomance
	** STYLE
		- added styles for form
	** FIXED
		- fixed copying via central board
		- some fixes related to switching between users

--- VER. 0.4.0 ---

	** COMMON
		- added FireStore
		- added Auth and Google Auth
		- added authorization and registration form
	** STYLE
		- 'copy' span dinamycally changed it color
		- some footer icons changes 
	** FIXED
		- fixed the application crash after first launch
		- fixed the clipboard watching proccess
		- fixed the work liked list after authorization

--- VER. 0.3.2 ---

	** COMMON
		- checking the clipboard when the user returns to the application
	** STYLE
		- added hover and active styles
		- added adaptive design for mobile devices
		- rethinking favorite colors list and menu
	** FIXED
		- removed horizonal scroll
		- resetting value fixed
		- now page reloading doesn't change user's clipboard 

--- VER. 0.3.1 ---

	** COMMON
		- added buttons for improving the functionality of the application
		- now user can copy URL address and share it with friends
	** STYLE
		- application redesiged
		- added images
		- there is uniform style
	** FIXED
		- some bugs fixed
		- some bugs added

--- VER. 0.3.0 ---

	** COMMON
		- now address bar displays actual color
		- actual color stores in LocalStorage
		- restrict horizontal scroll when working with the slider on android devices
		- now you can press and hold for 'accurate adjustment' of specific value
	** FIXED
		- after page reloading clipboard doesn't change anymore
		- now value does not change user interacts with slider

--- VER. 0.2.5 ---

	** COMMON
		- copy target color format more clearly
		- almost completely android support
	** FIXED
		- return to initial value after use 'random color' and 'change position of any HSL Slider'
		- bug when user use 'accurate adjustment', now user won't see the value less than 0 and greater then allowed MAX

--- VER. 0.2.3 ---

	** COMMON
		- added adjust color settings by one-time pressing left and right of specific slider
	** FIXED
		- now color copy even if targetColorFormat didn't change

--- VER. 0.2.2 ---

	** COMMON
		- added custom slider for HUE, SATURATION AND LIGHTNESS
		- automatic copy target color when choosing it
	** STYLES
		- changed style of custom sliders to the appropriate one
	** MINOR
		- work on changing the structure of the project is in full swing
		- added mobile half-support

--- VER. 0.2.1 ---

	** COMMON
		- added LocalStorage support
		- some attempts to make custom input[type=range] 
	** MINOR
		- attempt to add firebase store

--- VER. 0.2.0 ---

	** COMMON
		- added Favorite color list
		- user can swiches between favorite colors
		- user can add and remove favorite colors

--- VER. 0.1.1 ---

	** COMMON
		- added feature to choose target color format
		- added feature to copy target color format to clipboard

--- VER. 0.1.0 ---

	** COMMON
		- initialized project
		- you can get random color by clicking on the corresponding button
