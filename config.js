module.exports = {
    overrideFiles: false,
    useTypescript: true,
    componentsFolder: 'src/components',
    includeTestFile: true,
    includeIndexFile: true,
    testsFolder: 'test/functional/components',
    styleFileExtension: 'css',
    componentFileExtension: 'tsx',
    defaultTemplates: {
        component: './templates/component.template',
        style: './templates/style.template',
        styleTypes: './templates/styletypes.template',
        index: './templates/index.template',
        test: './templates/test.template'
    }
};
