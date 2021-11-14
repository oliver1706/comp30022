import React from "react"
import axios from "axios"
import { EditCustomer } from "./EditCustomer";


export function Body(props) {

    [activeItem, setActiveItem] = useState(null);

    return (
        <div>
        {props.dataList.length ?(<EditCustomer
            customer={dataList[0]}
            newCustomer={false}
            handleSubmit={handleSubmit}
            editable={true}
        />) : null}
        </div>
    )

}