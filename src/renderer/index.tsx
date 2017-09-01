import * as React from 'react';
import * as ReactDOM from 'react-dom';

class Hello extends React.Component {
    render() {
        return <div>Hello, world!</div>;
    }
}

ReactDOM.render(<Hello />, document.getElementById('root'));
