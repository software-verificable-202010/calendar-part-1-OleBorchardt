import React from "react";
import "./selectList.css"

export default class SelectList extends React.Component {

    constructor(props) {
        super(props);
        this.data = props.data;
    }

    render() {
        let popup = this.data.map((data) => {
            return(
                <div key={data}>
                    <button className="linkButton" onClick={(e) => {this.props.onSelectListChange(e, data)}}>
                        {data}
                    </button>
                </div>
            );
        });
        return (
            <div className="selectList">
                {popup}
            </div>
        )
    }
}