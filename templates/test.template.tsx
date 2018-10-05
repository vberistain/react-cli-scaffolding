import * as React from 'react';
import { shallow } from 'enzyme';
import { COMPONENT_NAME } from 'COMPONENT_RELATIVE_PATH';

describe('COMPONENT_NAME', () => {
    describe('render', () => {
        it('should render COMPONENT_NAME correctly', () => {
            const component = shallow(<COMPONENT_NAME />);
        });
    });
});
