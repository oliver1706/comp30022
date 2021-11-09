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


export function CreateOrgOrDept(props) {

    const [selection, setSelection] = useState("organisations");
    const [nameEntry, setNameEntry] = useState("");

    const handleSubmit = () => {

        let data = {
            name: nameEntry
        }

        let form = new FormData();

        form.append('name', nameEntry);
        console.log(form);
        axios
            .post(process.env.REACT_APP_BACKEND_URL + `/app/${selection}/`, form, getAuthheader())
            .then((res) => console.log(res))
            .catch((err) => console.log(err));
        
    }

    return (
        <div>
            <Form>
                <select
                    value={selection}
                    onChange={(e) => setSelection(e.target.value)}
                >
                    <option value='organisations'>Organisation</option>
                    <option value='departments'>Department</option>
                </select>
                <Input
                    className = ''
                    type='text'
                    name='name'
                    value={nameEntry}
                    onChange={(e) => setNameEntry(e.target.value)}
                ></Input>
                <button onClick={() => handleSubmit()}>Submit</button>
            </Form>

            
        </div>

    )
}