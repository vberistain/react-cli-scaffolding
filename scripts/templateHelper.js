'use strict';

const mkdirp = require('mkdirp');
const fs = require('fs');
const path = require('path');
const deepmerge = require('deepmerge');

const defaultConfig = require('../config/default');
let userConfig = {};
try {
    userConfig = require(path.join(process.cwd(), './rcs.config'));
} catch (e) {}

const config = deepmerge(defaultConfig, userConfig);

class Template {
    constructor(componentName, componentFolder, option) {
        this.componentName = componentName;
        this.componentFolder = componentFolder || path.join('./', config.componentsFolder);
        this.option = option;
        this.willOverride = option === '-o' || config.overrideFiles;
        this.config = config;
        this.testBasePath = path.join('./', this.config.testsFolder);
        this.testRelativePath = this._getTestRelativePath();
        this.testAbsolutePath = this._getTestAbsolutePath();
    }
    get(templateType) {
        const isCustomTemplate = !!(userConfig.templates && userConfig.templates[templateType]);
        const templatePath = config.templates[templateType];
        const templateUrl = path.join(process.cwd(), templatePath);
        try {
            return fs.readFileSync(templateUrl, 'utf8' );
        } catch(error) {
            console.log('\x1b[31m%s\x1b[0m', `Can\'t find template ${templateUrl}`);
            process.exit(1);
        }
    }
    _getTestAbsolutePath() {
        if (this.testRelativePath === '') {
            return this.testBasePath
        }
        else {
            return this.testBasePath + '/' + this.testRelativePath
        }
    }
    _getTestRelativePath() {
        const testPathArray = this.componentFolder.split('/');
        const i = testPathArray.indexOf('components');
        return testPathArray.slice(i + 1, testPathArray.length).join('/');
    }
    writeInFile(template, path, outputFileName) {
        mkdirp.sync(path);
        if (fs.existsSync(`${path}/${outputFileName}`) && !this.willOverride) {
            console.log('\x1b[31m%s\x1b[0m', `File ${outputFileName} already exists in ${path}.`);
            return;
        }
        try {
            fs.writeFileSync(`${path}/${outputFileName}`, template);
            console.log(
                '\x1b[32m%s\x1b[0m',
                `File ${outputFileName} created successfully in ${path}`
            );
        } catch (error) {
            console.log(error);
        }
    }
    writeVariables(template, variables) {
        let result = template;
        Object.keys(variables).forEach(key => {
            result = result.replace(new RegExp(`%${key}%`, 'g'), variables[key]);
        });
        return result;
    }
    writeTest() {
        const outputFileName = `${this.componentName}.test.tsx`;
        let template = this.get('test');
        template = this.writeVariables(template, {
            COMPONENT_NAME: this.componentName,
            COMPONENT_RELATIVE_PATH: `Components/${this.testRelativePath !== '' ?
                this.testRelativePath + '/' : ''}${this.componentName}`
        });

        this.writeInFile(template, this.testAbsolutePath, outputFileName)
    }

    write(templateType, outputFileName, fileExtension) {
        let template = this.get(templateType);

        template = this.writeVariables(template, {
            COMPONENT_NAME: this.componentName,
            FILE_EXTENSION: fileExtension
        });

        this.writeInFile(template, `${this.componentFolder}/${this.componentName}`, outputFileName)
    }

}

module.exports = Template;
