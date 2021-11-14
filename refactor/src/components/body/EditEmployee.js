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

export function EditEmployee(props) {

    const [editable, setEditable] = useState(props.editable);
    const [editButtonStyle, setStyle] = useState(styles.editButtonEmp);

    //For each field, id is grabbed only at submission, it is immutable
    const [username, setUsername] = useState(props.employee.username);
    const [password, setPassword] = useState(props.employee.password);
    const [first_name, setFirst_name] = useState(props.employee.first_name);
    const [last_name, setLast_name] = useState(props.employee.last_name);
    const [job_title, setJob_title] = useState(props.employee.job_title);
    const [phone, setPhone] = useState(props.employee.phone);
    const [department, setDepartment] = useState(props.employee.department);
    const [email, setEmail] = useState(props.employee.email);
    const [photo, setPhoto] = useState(props.employee.photo);

    // For enumerating departments in selection
    const [allDepts, setAllDepts] = useState([]);

    useEffect(() => {
        refreshData(setAllDepts);
    }, []) // Empty array so only run on mount

    const switchStyle = () => {
        if (editButtonStyle == styles.editButtonEmp) {
            setStyle(styles.editButtonClickedEmp);
        } else {
            setStyle(styles.editButtonEmp);
        }
    }

    const handleChange = (e) => {
        let {name, value} = e.target;
        switch (name) {
            case 'photo':
                value = e.target.files[0];
                setPhoto(value);
                break;
            case 'username':
                setUsername(value);
                break;
            case 'password':
                setPassword(value);
                break;
            case 'first_name':
                setFirst_name(value);
                break;
            case 'last_name':
                setLast_name(value);
                break;
            case 'job_title':
                setJob_title(value);
                break;
            case 'phone':
                setPhone(value);
                break;
            case 'department':
                setDepartment(value);
                break;
            case 'email':
                setEmail(value);
                break;

        }
    }

    const handleSave = () => {

        let employee = props.employee;
        let hasId = false;

        for(let propName in employee) {
            if(employee.hasOwnProperty(propName) && propName === "id") {
                hasId = true;
            }
        }
        if( hasId ) {
            let data = {
                id: employee.id,
                username: username,
                first_name: first_name,
                last_name: last_name,
                job_title: job_title,
                phone: phone,
                department: department,
                password: password,
                email: email,
            }
            props.handleSubmit('employees', data);
        } else {
            let data = {
                photo: getPhotoForSubmission(props.newEmployee, photo),
                username: username,
                first_name: first_name,
                last_name: last_name,
                job_title: job_title,
                phone: phone,
                department: department,
                password: password,
                email: email,
            }
            props.handleSubmit('employees', data);
        }
        props.handleClose();
        
    }

    const departmentSelection = () => {
        return allDepts.map((dept) => (
            <option value={dept.id}>{dept.name}</option>
        ));
    }

    return (
        <Container>
            <header>
                <h2 className = {styles.header}>{props.employee.first_name} {props.employee.last_name}</h2>
                <Button
                    color="success"
                    onClick={() =>props.handleClose()}
                    className={styles.closeButton}
                >Close
                </Button>
                <button className={editButtonStyle} onClick={() => {setEditable(!editable); switchStyle();}}>Edit</button>

            </header>
            
            <div>
                <Form className = {styles.inputForm}>
                <FormGroup>
                        {props.newEmployee ? (
                            <div>
                                <Label for="photo">Photo</Label>
                                <Input
                                    disabled={! editable}
                                    type="file"
                                    name="photo"
                
                                    onChange={handleChange}
                                    className = {styles.customerInput}
                                />
                            </div>
                        ) : (
                            <img 
                                className = {styles.customerImg} 
                                src={photo} 
                                width="250" height="250"
                            />
                        )}
                        
                    </FormGroup>
                    <FormGroup>
                        <Label for="username">Username</Label>
                        <Input
                            className = {styles.customerInput}
                            disabled={! editable}
                            type="text"
                            name="username"
                            value={username}
                            onChange={handleChange}
                            placeholder="Enter Employee Username"
                        />
                    </FormGroup>
                    <FormGroup>
                        <Label for="password">Password</Label>
                        <Input
                            className = {styles.customerInput}
                            disabled={! editable}
                            type="text"
                            name="password"
                            value={password}
                            onChange={handleChange}
                            placeholder="Enter Password"
                        />
                    </FormGroup>
                    <FormGroup>
                        <Label for="first_name">First Name</Label>
                        <Input
                            className = {styles.customerInput}
                            disabled={! editable}
                            type="text"
                            name="first_name"
                            value={first_name}
                            onChange={handleChange}
                            placeholder="Enter Employee First Name"
                        />
                    </FormGroup>
                    <FormGroup>
                    <Label for="last_name">Last Name</Label>
                        <Input
                            className = {styles.customerInput}
                            disabled={! editable}
                            type="text"
                            name="last_name"
                            value={last_name}
                            onChange={handleChange}
                            placeholder="Enter Employee Last Name"
                        />
                    </FormGroup>
                    <FormGroup>
                        <Label for="job_title">Job Title</Label>
                        <Input
                            className = {styles.customerInput}
                            disabled={! editable}
                            type="text"
                            name="job_title"
                            value={job_title}
                            onChange={handleChange}
                            placeholder="Enter Employee Job Title"
                        />
                    </FormGroup>
                    <FormGroup>
                        <Label for="phone">Phone</Label>
                        <Input
                            className = {styles.customerInput}
                            disabled={! editable}
                            type="text"
                            name="phone"
                            value={phone}
                            onChange={handleChange}
                            placeholder="Enter Employee Phone Number"
                        />
                    </FormGroup>
                    <FormGroup>
                        <Label for="email">Email</Label>
                        <Input
                            disabled={! editable}
                            type="text"
                            name="email"
                            value={email}
                            onChange={handleChange}
                            placeholder="john@example.com"
                            className = {styles.customerInput}
                        />
                    </FormGroup>
                    <FormGroup>
                        <Label for="department">Department</Label>
                        
                        <select 
                            className = {styles.customerInput}
                            disabled={! editable}
                            name = "department"
                            value={department}
                            onChange={handleChange}
                            placeholder="Select a Department">
                            {departmentSelection()}
                        </select>
                    </FormGroup>
                </Form>
            </div>
            <footer>
                <Button
                color="success"
                onClick={() => handleSave()}
                className = {styles.saveButton}
                >
                    Save
                </Button>
            </footer>
        </Container>
    )
}

function refreshData(setDepts) {
    axios.get(process.env.REACT_APP_BACKEND_URL + `/app/departments/`, getAuthheader())
        .then((res) => setDepts(res.data.results));
}

function getPhotoForSubmission(newEmployee, photo) {

    if(newEmployee) {
        return photo;
    } else {
        return '';
    }
}