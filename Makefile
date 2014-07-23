game_of_life_table.closure.js: game_of_life_table.js
	java -jar ~/app/closure/compiler.jar --compilation_level ADVANCED --js_output_file $@ $<
