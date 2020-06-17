//This file contains the Quote component of the webapp which shows the quotes from the backend.

import React, { Component } from 'react';

export default class Quote extends Component {
    render() {
        var {en,author} = this.props.quote;
        return (
            <div>
                {/*Shows quote */}
                <hr />
                <div id="quote">
                    "{en}"
                </div>
                {/*Shows author */}
                <div id="author">
                    - {author}
                </div>
                {/* <br /> */}
                <hr />
            </div>
        )
    }
}


