const mkdirp = require('mkdirp');
const fs = require('fs');
const path = require('path');

class Template {
    constructor(config, componentName, componentFolder, option) {
        this.config = config;
        this.componentName = componentName;
        this.componentFolder = path.join('./', componentFolder || this.config.componentsFolder);
        this.willOverride = option === '-o' || this.config.overrideFiles;
        this.testBasePath = path.join('./', this.config.testsFolder);
        this.testRelativePath = this._getTestRelativePath();
        this.testAbsolutePath = this._getTestAbsolutePath();
    }

    get(templateType) {
        try {
            if (this.config.templates && this.config.templates[templateType]) {
                return fs.readFileSync(
                    path.join(process.cwd(), this.config.templates[templateType]),
                    'utf8'
                );
            }
            return fs.readFileSync(
                path.join(__dirname, '../', this.config.defaultTemplates[templateType]),
                'utf8'
            );
        } catch (error) {
            console.log(
                '\x1b[31m%s\x1b[0m',
                `Can't find template ${this.config.defaultTemplates[templateType]}`
            );
            return process.exit(1);
        }
    }

    _getTestAbsolutePath() {
        if (this.testRelativePath === '') {
            return this.testBasePath;
        }
        return this.testBasePath + '/' + this.testRelativePath;
    }

    _getTestRelativePath() {
        const testPathArray = this.componentFolder.split('/');
        const i = testPathArray.indexOf('components');
        return testPathArray.slice(i + 1, testPathArray.length).join('/');
    }

    writeInFile(template, filePath, outputFileName) {
        mkdirp.sync(filePath);
        if (fs.existsSync(`${filePath}/${outputFileName}`) && !this.willOverride) {
            console.log(
                '\x1b[31m%s\x1b[0m',
                `File ${outputFileName} already exists in ${filePath}.`
            );
            return;
        }
        try {
            fs.writeFileSync(`${filePath}/${outputFileName}`, template);
            console.log(
                '\x1b[32m%s\x1b[0m',
                `File ${outputFileName} created successfully in ${filePath}`
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
            COMPONENT_RELATIVE_PATH: `Components/${
                this.testRelativePath !== '' ? this.testRelativePath + '/' : ''
            }${this.componentName}`
        });

        this.writeInFile(template, this.testAbsolutePath, outputFileName);
    }

    write(templateType, outputFileName, fileExtension) {
        let template = this.get(templateType);

        template = this.writeVariables(template, {
            COMPONENT_NAME: this.componentName,
            FILE_EXTENSION: fileExtension,
            STYLE_FILE_EXTENSION: this.config.styleFileExtension
        });

        this.writeInFile(template, `${this.componentFolder}/${this.componentName}`, outputFileName);
    }
}

module.exports = Template;
