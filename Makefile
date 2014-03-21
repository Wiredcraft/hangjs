default:
	@./node_modules/.bin/gulp
brower:
	@./node_modules/.bin/gulp --open

.PHONY: default brower
