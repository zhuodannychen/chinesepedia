import React, { Component } from 'react';

class CharGrid extends Component {
    render() {
        return (
            <div>
                <button type="button"
                        id={this.props.id}
                        onClick={this.props.onClick}
                        style={this.props.style}                      
                        className="btn btn-secondary float-left">

                    <p className="grid-hanzi">{this.props.hanzi}</p>
                    <p className="grid-id">{this.props.id}</p>
                </button>
            </div>
        )
    }
}

export default CharGrid