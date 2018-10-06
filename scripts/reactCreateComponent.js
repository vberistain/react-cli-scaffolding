#! /usr/bin/env node

const fs = require('fs');
const path = require('path');
const defaultConfig = require('../config/default');
const SCRIPT_PATH = process.cwd();

let userConfig = {};
try {
    userConfig = require(path.join(SCRIPT_PATH, './rcs.config'));
} catch (e) {}

const config = { ...defaultConfig, ...userConfig };

const mkdirp = require('mkdirp');

const componentName = process.argv[2];
const componentFolder = process.argv[3] || path.join('../', config.componentsFolder);
const option = process.argv[4];


if (!componentName) {
    console.log('Please enter a component name: rcc Header');
    process.exit(1);
}

const willOverride = option === '-o' || config.overrideFiles;

const writeTemplate = (templateName, componentName, componentFolder, outputFileName) => {
    let template = fs.readFileSync(
        path.join(__dirname, '../templates') + `/${templateName}`,
        'utf8'
    );
    template = template.replace(/COMPONENT_NAME/g, componentName);
    const newPath = `${path.join(SCRIPT_PATH, `./${componentFolder}`)}`;
    mkdirp.sync(newPath);
    if (fs.existsSync(`${newPath}/${outputFileName}`) && !willOverride) {
        console.log('\x1b[31m%s\x1b[0m', `File ${outputFileName} already exists in ${newPath}.`);
        return;
    }
    try {
        fs.writeFileSync(`${newPath}/${outputFileName}`, template);
        console.log(
            '\x1b[32m%s\x1b[0m',
            `File ${outputFileName} created successfully in ${newPath}`
        );
    } catch (error) {
        console.log(error);
    }
};

const writeTestTemplate = (componentName, componentFolder, outputFileName) => {
    let template = fs.readFileSync(
        path.join(__dirname, '../templates') + `/test.template.tsx`,
        'utf8'
    );
    const testBasePath = path.join('./', config.testsFolder);

    const testPathArray = componentFolder.split('/');
    const i = testPathArray.indexOf('components');
    const testPath =
        testBasePath + testPathArray.slice(i + 1, testPathArray.length).join('/') !== ''
            ? testBasePath + '/' + testPathArray.slice(i + 1, testPathArray.length).join('/') 
            : testBasePath;

    template = template.replace(/COMPONENT_NAME/g, componentName);
    template = template.replace(
        /COMPONENT_RELATIVE_PATH/g,
        `Components/${
            testPathArray.slice(i + 1, testPathArray.length).join('/') !== ''
                ? testPathArray.slice(i + 1, testPathArray.length).join('/') + '/'
                : ''
        }${componentName}`
    );
    const newPath = `${path.join(SCRIPT_PATH, `./${testPath}`)}`;
    mkdirp.sync(newPath);

    if (fs.existsSync(`${newPath}/${outputFileName}`) && !willOverride) {
        console.log('\x1b[31m%s\x1b[0m', `File ${outputFileName} already exists in ${newPath}.`);
        return;
    }
    fs.writeFileSync(`${newPath}/${outputFileName}`, template);
    console.log('\x1b[32m%s\x1b[0m', `File ${outputFileName} created successfully in ${newPath}`);
};

writeTemplate(
    'component.template.tsx',
    componentName,
    `${componentFolder}/${componentName}`,
    `${componentName}.tsx`
);
writeTemplate(
    'css.template.scss',
    componentName,
    `${componentFolder}/${componentName}`,
    `${componentName}.scss`
);
writeTemplate(
    'index.template.ts',
    componentName,
    `${componentFolder}/${componentName}`,
    'index.ts'
);

writeTemplate(
    'css.types.template.d.ts',
    componentName,
    `${componentFolder}/${componentName}`,
    `${componentName}.scss.d.ts`
);


writeTestTemplate(componentName, componentFolder, `${componentName}.test.tsx`);

process.exit(0);
