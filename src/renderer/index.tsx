import * as React from 'react';
import * as ReactDOM from 'react-dom';

class Hello extends React.Component {
    render() {
        return (
            <div>
                <h2>Hello, world!</h2>
            </div>
        );
    }
}

ReactDOM.render(<Hello />, document.getElementById('root'));
