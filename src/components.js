import React from "react";

var topology_endpoint = "http://127.0.0.1:5000/";
var basic_endpoint = "https://127.0.0.1:5000/basic_request";

export class Request extends React.Component {
    render(){
        return(
            <div className="col-sm-10 col-sm-offset-1">
                <br />
                <div className="row">
                    <div className="col-sm-4"><ChosenSelect items={this.state.Sources} id="Sources" placeholder="Select Source Node" onChange={this.handleSourceSelect} /></div>
                    <div className="col-sm-4"><ChosenSelect items={this.state.SourcePorts} id="SourcePorts" placeholder="Select Source Port" onChange={this.sourcePortSelect} /></div>
                    <div className="col-sm-4"><ChosenSelect items={this.state.Bandwidth} id="BandwidthSource" placeholder="Select Bandwidth" onChange={this.bandwidthSource} /></div>
                </div><br />
                <div className="row">
                    <div className="col-sm-4"><ChosenSelect items={this.state.Sources} id="Destination" placeholder="Select Destination Node" onChange={this.handleDestinationSelect}/></div>
                    <div className="col-sm-4"><ChosenSelect items={this.state.DestinationPorts} id="DestinationPorts" placeholder="Select Destination Port" onChange={this.destinationPortSelect} /></div>
                    <div className="col-sm-4"><ChosenSelect items={this.state.Bandwidth} id="BandwidthDestination" placeholder="Select Bandwidth" onChange={this.bandwidthDestination} /></div>
                </div><br />
                <div className="row">
                    <div className="col-sm-6">
                        <DateTimePicker id="Start" onChange={this.startChange} placeholder="Enter Start Date & Time" />
                    </div>
                    <div className="col-sm-6">
                        <DateTimePicker id="End" onChange={this.endChange} placeholder="Enter End Date & Time" />
                    </div>
                </div><br />
                <div className="text-center">
                	<span className="btn btn-primary" onClick={this.makeCall.bind(this)}>Request</span>
                </div><br />
                <div className="row">
                	<textarea id="text_response" style={{width:"100%"}} readOnly="readOnly" rows={15} />
                </div>
            </div>
        );
    }
    componentDidMount(){
        $.ajax({
            url:topology_endpoint,
            dataType:"json",
            success:function(result){
                    let topo = parseTopology(result);
                    this.setState({
                        Topology:topo,
                        Sources:topo.Nodes,
                    });
                }.bind(this)
        });
    }
    makeCall(){
        if(this.state.start.length == 0 || this.state.end.length == 0 || this.state.sourcePort.length == 0 || 
        this.state.destPort.length == 0 || this.state.azMbps.length == 0 || this.state.zaMbps.length == 0 || 
        this.state.sourceDevice.length == 0 || this.state.destDevice.length == 0){
            return;
        }
        $.ajax({
            url:basic_endpoint,
            dataType:"json",
            method:"POST",
            data:{
                start:this.state.start,
                end:this.state.end,
                sourcePort:this.state.sourcePort,
                destPort:this.state.destPort,
                azMbps:this.state.azMbps,
                zaMbps:this.state.zaMbps,
                sourceDevice:this.state.sourceDevice,
                destDevice:this.state.destDevice,
                connectionId:'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {var r = Math.random()*16|0,v=c=='x'?r:r&0x3|0x8;return v.toString(16);}),
            },
            success:function(result){
                $("#text_response").val(JSON.stringify(result,null,4));
            }
        });
    }
    startChange(value){
        this.setState({start:value});
    }
    endChange(value){
        this.setState({end:value});
    }
    sourcePortSelect(value){
        this.setState({sourcePort:value});
    }
    destinationPortSelect(value){
        this.setState({destPort:value});
    }
    bandwidthSource(value){
        this.setState({azMbps:value});
    }
    bandwidthDestination(value){
        this.setState({zaMbps:value});
    }
    constructor(props,context){
        super(props,context);
        this.state = {
            Sources:[],
            SourcePorts:[],
            Bandwidth:[
                "1",
                "2",
                "5",
                "10",
                "20",
                "50",
                "100",
                "200",
                "500"
            ],
            DestinationPorts:[],
            Topology:{},
            sourcePort:"",
            destPort:"",
            sourceDevice:"",
            destDevice:"",
            azMbps:"",
            zaMbps:"",
            start:"",
            end:"",
        };
        this.handleSourceSelect = this.handleSourceSelect.bind(this);
        this.handleDestinationSelect = this.handleDestinationSelect.bind(this);
        this.sourcePortSelect = this.sourcePortSelect.bind(this);
        this.destinationPortSelect = this.destinationPortSelect.bind(this);
        this.bandwidthSource = this.bandwidthSource.bind(this);
        this.bandwidthDestination = this.bandwidthDestination.bind(this);
        this.startChange = this.startChange.bind(this);
        this.endChange = this.endChange.bind(this);
    }
    handleSourceSelect(value){
        if(value.length == 0){
            this.setState({SourcePorts:[],sourceDevice:""});
            return;
        }
        let ports = this.state.Topology['Ports'][value];
        this.setState({SourcePorts:ports,sourceDevice:value});
    }
    handleDestinationSelect(value){
        if(value.length == 0){
            this.setState({DestinationPorts:[],destDevice:""});
            return;
        }
        let ports = this.state.Topology['Ports'][value];
        this.setState({DestinationPorts:ports,destDevice:value});
    }
}

class ChosenSelect extends React.Component {
    render(){
        return(
            <div className="col-sm-10 col-xs-10 col-sm-offset-1 col-xs-offset-1">
                <div className="center-block">
                    <select id={this.props.id} data-placeholder={this.props.placeholder}>
                        <option></option>
                        {this.props.items.map((entry,i)=>{
                            return(<option value={entry} key={entry}>{entry}</option>);                        
                        })}
                    </select>
                </div>
            </div>
        );
    }
    componentDidMount(){
        $("#"+this.props.id).chosen({width: "100%",allow_single_deselect:true});
        $("#"+this.props.id).chosen().change(function(){
            this.props.onChange($("#"+this.props.id).val());
        }.bind(this));
    }
    componentDidUpdate(){
        $("#"+this.props.id).trigger("chosen:updated");
    }
}

class DateTimePicker extends React.Component {
    render(){
        return(
            <div className="col-sm-8 col-sm-offset-2">
                <input placeholder={this.props.placeholder} type="text" className="form-control flatpickr" id={this.props.id} />
            </div>);
    }
    componentDidMount(){
        $("#"+this.props.id).flatpickr({
            enableTime:true,
            dateFormat: "m d Y H:i",
            inline:true,
            onChange: function(dateObj,dateStr, instance){
                this.props.onChange(dateStr);
            }.bind(this),
        });
    }
}

function parseTopology(json){
    let parsed_object = {};
    parsed_object['Nodes'] = [];
    parsed_object['Ports'] = {};
    for (let value of json.devices){
        parsed_object['Nodes'].push(value['urn']);
        parsed_object['Ports'][value['urn']] = [];
        let index = "TopoVertex(urn="+value['urn']+", vertexType=ROUTER)";
        for(let port of json.portsForDevice[index]){
            parsed_object['Ports'][value['urn']].push(port['urn']);
        }
    }
    return(parsed_object);
}
