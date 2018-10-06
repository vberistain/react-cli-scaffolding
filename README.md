# react-cli-scaffolding

> Creates React components from the command line

## Install

```
npm i -g react-cli-scaffolding
```


## API

### rcc

> Creates a new react component, css file, test file, and index.ts file for easier importing in the given directory.

**Params**

* `ComponentName` **{string}**: component name    
* `path` **{string}**: path the component will be created at. Optional    

**Example**

```
rcc Footer ./src/components/ui/Footer
```

![alt text](https://raw.githubusercontent.com/vberistain/react-cli-scaffolding/master/img/footer_ide.png)

![alt text](https://raw.githubusercontent.com/vberistain/react-cli-scaffolding/master/img/footer_test_ide.png)


## Config

> Create a rcs.config.js file in the root of the directory to override the default configuration

**Example**

```js
module.exports = {
    componentsFolder: './src/components',
    testsFolder: './test/functional/components',
    overrideFiles: true
};
```

## Templates

Component:

```tsx
import * as React from 'react';
import * as styles from './Footer.css';

type Props = {};

type State = {};

class Footer extends React.Component<Props, State> {
    state = {};

    render() {
        return <div className={styles.container} />;
    }
};

export default Footer;
```

Test:

```tsx
import * as React from 'react';
import { shallow } from 'enzyme';
import { Footer } from 'Components/ui/Footer';

describe('Footer', () => {
    describe('render', () => {
        it('should render Footer correctly', () => {
            const component = shallow(<Footer />);
        });
    });
});
```

CSS:
```css
.container {
    display: block;
}
```

index:
```ts
export { default as Header } from './Header';
```

## Author
- [github/vberistain](https://github.com/vberistain)

## License
Copyright © 2018, Victor Beristain. Released under the [MIT License](LICENSE).


