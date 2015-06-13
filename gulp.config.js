module.exports = {

	dest: './build',
	src: [
		'./src/*.js'
	],
	watch: [
		'./src/*.js'
	],
	jsbeautifier: {
		braceStyle: 'collapse',
		indentSize: 3,
		indentWithTabs: true,
		spaceInParen: true,
		spaceBeforeConditional: true
	},
	babel: true,

};
