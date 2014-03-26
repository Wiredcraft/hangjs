dev: i boweri
	@./node_modules/.bin/gulp development --open --port 4000
i:
	@npm --registry=http://r.cnpmjs.org \
       --cache=${HOME}/.npm/.cache/cnpm \
       --disturl=http://cnpmjs.org/dist \
       --userconfig=${HOME}/.cnpmrc \
       install
boweri: i
	@./node_modules/.bin/bower install

.PHONY: dev i boweri
