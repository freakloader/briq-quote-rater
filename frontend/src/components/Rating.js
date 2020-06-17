//This file contains the Rating component of the webapp.

import React from 'react';
import Rater from 'react-rater';

export default class Rating extends React.Component {
    render() {
        return (
            <div id="rating">
                {/* In this component, default number of stars is 5 and default value is 0 stars
                  which was exactly what I want, so didn't include it explicitly. */}
                <Rater onRate={this.props.onRate}/>
            </div>
        );
    }
}
