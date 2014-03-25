default:
	@./node_modules/.bin/gulp
brower:
	@./node_modules/.bin/gulp --open
i:
	@npm --registry=http://r.cnpmjs.org \
       --cache=${HOME}/.npm/.cache/cnpm \
       --disturl=http://cnpmjs.org/dist \
       --userconfig=${HOME}/.cnpmrc \
       install
boweri:
	@./node_modules/.bin/bower install

.PHONY: default brower i boweri
