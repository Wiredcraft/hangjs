default:
	@./node_modules/.bin/gulp
brower:
	@./node_modules/.bin/gulp --open
boweri:
	@./node_modules/.bin/bower install

.PHONY: default brower boweri
