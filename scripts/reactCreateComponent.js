#! /usr/bin/env node

const COMPONENT_NAME = process.argv[2];
const COMPONENT_FOLDER = process.argv[3] ;
const OPTION = process.argv[4];

const Template = require('./templateHelper');
const template = new Template(COMPONENT_NAME, COMPONENT_FOLDER, OPTION)

if (!COMPONENT_NAME) {
    console.log('Please enter a component name: rcc Header');
    process.exit(1);
}

template.write(
    'component',
    `${templateInstance.componentName}.${template.config.componentFileExtension}`,
    config.componentFileExtension
);

template.write(
    'style',
    `${templateInstance.componentName}.${template.config.styleFileExtension}`
);

template.write(
    'index',
    'index.ts'
);

template.write(
    'styleTypes',
    `${templateInstance.componentName}.${template.config.styleFileExtension}.d.ts`
);

template.writeTest();

process.exit(0);
