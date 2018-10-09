const chai = require('chai');
const sinonChai = require('sinon-chai');
const expect = chai.expect;
const Template = require('../../scripts/templateHelper');
const deepMerge = require('deepmerge');
const sinon = require('sinon');
const fs = require('fs');
const path = require('path');

chai.should();
chai.use(sinonChai);

const defaultConfig = require('../../config');

describe('TemplateHelper', () => {
    describe('constructor', () => {
        it('should set componentName correctly ', () => {
            const template = new Template(defaultConfig, 'Header');
            expect(template.componentName).to.equal('Header');
        });

        it('should set componentFolder correctly from default config', () => {
            const template = new Template(defaultConfig, 'Header');
            expect(template.componentFolder).to.equal(defaultConfig.componentsFolder);
        });

        it('should set componentFolder correctly from parameter', () => {
            const template = new Template(defaultConfig, 'Header', 'src/components');
            expect(template.componentFolder).to.equal('src/components');
        });

        it('should set willOverride correctly from parameters', () => {
            const template = new Template(defaultConfig, 'Header', undefined, '-o');
            expect(template.willOverride).to.equal(true);
        });

        it('should set willOverride correctly from user config', () => {
            const config = deepMerge(defaultConfig, {
                overrideFiles: true
            });
            const template = new Template(config, 'Header');
            expect(template.willOverride).to.equal(true);
        });

        it('should set testBasePath correctly from config', () => {
            const template = new Template(defaultConfig, 'Header');
            expect(template.testBasePath).to.equal(defaultConfig.testsFolder);
        });

        it('should set empty string as testRelativePath', () => {
            const template = new Template(defaultConfig, 'Header', 'src/components');
            expect(template.testRelativePath).to.equal('');
        });

        it('should set the right testRelativePath when path is deeper than components path', () => {
            let template = new Template(defaultConfig, 'Header', 'src/components/ui');
            expect(template.testRelativePath).to.equal('ui');

            template = new Template(defaultConfig, 'Header', 'src/components/ui/layout');
            expect(template.testRelativePath).to.equal('ui/layout');
        });

        it('should the right testAbsolutePath', () => {
            let template = new Template(defaultConfig, 'Header', 'src/components');
            expect(template.testAbsolutePath).to.equal('test/functional/components');

            template = new Template(defaultConfig, 'Header', 'src/components/ui');
            expect(template.testAbsolutePath).to.equal('test/functional/components/ui');
        });
    });

    describe('get', () => {
        let readFileSyncMock;
        beforeEach(() => {
            readFileSyncMock = sinon.stub(fs, 'readFileSync');
        });
        afterEach(() => {
            readFileSyncMock.restore();
        });
        it('should get the right template', () => {
            readFileSyncMock.returns('aaa');
            const template = new Template(defaultConfig, 'Header');
            const res = template.get('component');
            const absolutePath = path.join(
                process.cwd(),
                template.config.defaultTemplates['component']
            );
            expect(readFileSyncMock).to.have.been.calledWith(absolutePath);
            expect(res).to.equal('aaa');
        });
    });
});
