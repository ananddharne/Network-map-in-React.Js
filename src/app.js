import React from 'react';
import ReactDOM from 'react-dom';
import { TrafficMap } from "react-network-diagrams";
var topology = require("./topology.js");

class App extends React.Component {
    render(){
        return (
            <TrafficMap
                bounds={{x1: 0, y1: 0, x2: 200, y2: 150}}
                topology={topology}
                edgeDrawingMethod="bidirectionalArrow" />
        );
    }
}

ReactDOM.render(<App />,document.getElementById("body"));
