#! /usr/bin/env node
const deepmerge = require('deepmerge');
const path = require('path');

const COMPONENT_NAME = process.argv[2];
const COMPONENT_FOLDER = process.argv[3];
const OPTION = process.argv[4];

const Template = require('./templateHelper');

const getConfig = () => {
    const defaultConfig = require('../config');
    let userConfig = {};
    try {
        userConfig = require(path.join(process.cwd(), './rcs.config.js'));
    } catch (e) {}
    return deepmerge(defaultConfig, userConfig);
};

if (!COMPONENT_NAME) {
    console.log('Please enter a component name: rcc Header');
    process.exit(1);
}

const config = getConfig();
console.log(COMPONENT_FOLDER);
const template = new Template(config, COMPONENT_NAME, COMPONENT_FOLDER, OPTION);

template.write('component', `${template.componentName}.${template.config.componentFileExtension}`);

template.write('style', `${template.componentName}.${template.config.styleFileExtension}`);

if (config.includeTestFile) {
    template.write('index', config.useTypescript ? 'index.ts' : 'index.js');
}
if (config.useTypescript) {
    template.write(
        'styleTypes',
        `${template.componentName}.${template.config.styleFileExtension}.d.ts`
    );
}
if (config.includeTestFile) {
    template.writeTest();
}

process.exit(0);
