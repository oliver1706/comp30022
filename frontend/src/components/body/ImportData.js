import React, { useEffect, useState} from 'react'
import {
    Button,
    Container,
    Form,
    FormGroup,
    Input,
    Label,
} from "reactstrap"
import axios from 'axios'
import styles from '../../css/viewCustomer.module.css'
import { getAuthheader } from '../main/Util';


export function ImportData(props) {

    const [file, setFile] = useState(null);
    const [requestStatus, setRequestStatus] = useState("idle")

    const handleSubmit = () => {

        if (file != null) {
            let form = new FormData();
            setRequestStatus("waiting")
            form.append('file', file);

            axios
                .post(process.env.REACT_APP_BACKEND_URL + `/app/customers/import_data_file/`, form, getAuthheader())
                .then((res) => setRequestStatus("done"));
        }
    }

    function renderRequestStatus() {

        switch (requestStatus){

            case "idle":
                return (
                    <form>
                        <div className="">
                            <label>Import Data</label>
                            <input type="file" name="file" onChange={e => setFile(e.target.files[0])}></input>
                        </div>
                        <button onClick={() => handleSubmit()}>Import</button>
                    </form>
                    )
            case "waiting":
                return (
                    <div>waiting</div>
                )
            case "done":
                return (
                    <div>done</div>
                )
        }
    }


    return (
        <div>{renderRequestStatus()}</div>
    )
}