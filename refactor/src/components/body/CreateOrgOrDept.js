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
import styles from '../../css/createOrgOrDept.module.css'
import { getAuthheader } from '../main/Util';


export function CreateOrgOrDept(props) {

    const [departmentNameEntry, setDepartmentNameEntry] = useState("");
    const [organisationNameEntry, setOrganisationNameEntry] = useState("");

    const handleSubmit = (selection) => {


        let form = new FormData();
        switch (selection) {
            case 'departments':
                form.append('name', departmentNameEntry);
                break;
            case 'organisations':
                form.append('name', organisationNameEntry)
            default:
                break;
        }

        console.log(form);
        axios
            .post(process.env.REACT_APP_BACKEND_URL + `/app/${selection}/`, form, getAuthheader())
            .then((res) => console.log(res))
            .catch((err) => console.log(err));
        
    }

    return (
        <div>
            <Form>
                <div className={styles.create}>
                    <h1>Create Department</h1>
                    <Input
                        className = ''
                        type='text'
                        name='name'
                        value={departmentNameEntry}
                        onChange={(e) => setDepartmentNameEntry(e.target.value)}
                        placeholder='Enter Department Name'
                    ></Input>
                    <button onClick={() => handleSubmit('departments')}>Create</button>
                </div>
                <div className={styles.create}>
                    <h1>Create Organisation</h1>
                    <Input
                        className = ''
                        type='text'
                        name='name'
                        value={organisationNameEntry}
                        onChange={(e) => setOrganisationNameEntry(e.target.value)}
                        placeholder='Enter Organisation Name'
                    ></Input>
                    <button onClick={() => handleSubmit('organisations')}>Create</button>
                </div>
            </Form>

            
        </div>

    )
}