echo "Publishing ShivaLib:"
type shivaLib_main.js ^
shivaLib_props.js ^
shivaLib_controls.js ^
shivaLib_draw.js ^
shiva_graphics.js ^
shivalib_maps.js ^
shivalib_video.js ^
shivalib_subway.js ^
shivalib_network.js ^
shivalib_timeline.js ^
shivalib_colorpick.js > tmp
jsmin.exe <tmp >shivalib-min.js
rm tmp