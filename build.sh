#!/bin/bash
###################
# Build / deploy script
# Meant to be called by devops builder
###################

COMMIT_MSG=$1
if [ -z "$COMMIT_MSG" ]; then
    # default commit message
    COMMIT_MSG='New deployment'
fi

TMP_FOLDER=$(mktemp -d)

#
# Build process
#
npm install
bower install
gulp

# Copy build files
cp -a _site/* $TMP_FOLDER

#
# Deployment
#

# Stash changes to allow branch switch
git stash
git checkout gh-pages
cp -a $TMP_FOLDER/* .
git add .
git commit -am "$COMMIT_MSG"
git push

# Cleanup
rm -rf $TMP_FOLDER
