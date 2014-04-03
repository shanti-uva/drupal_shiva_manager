echo "Publishing ShivaLib"
cat shivaLib_main.js \
shivaLib_props.js \
shivaLib_controls.js \
shivaLib_draw.js \
shiva_graphics.js \
shivalib_maps.js \
shivalib_video.js \
shivalib_subway.js \
shivalib_network.js \
shivalib_timeline.js \
shivalib_colorpick.js \
shivalib_word.js \
shivalib_poster.js \
shivalib_image.js \
shivalib_data.js \
shivalib_graph.js \
> tmp
./jsmin <tmp >shivalib-min.js
rm tmp