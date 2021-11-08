import React, { useEffect, useState } from 'react'
import {
    Button,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Container,
    ContainerHeader,
    Form,
    FormControl,
    FormGroup,
    Input,
    Label,
} from "reactstrap";
import { FaAudioDescription } from 'react-icons/fa';
import axios from 'axios'
import styles from '../../css/viewCustomer.module.css'
import { getAuthheader } from '../main/Util';
import { CustomerView } from './CustomerView';

export function EditCustomer(props) {
    
    const [editable, setEditable] = useState(props.editable);
    
    // For each field, id is grabbed only at submission, it is immutable
    const [description, setDescription] = useState(props.customer.description);
    const [photo, setPhoto] = useState(props.customer.photo);
    const [first_name, setFirst_name] = useState(props.customer.first_name);
    const [last_name, setLast_name] = useState(props.customer.last_name);
    const [job_title, setJob_title] = useState(props.customer.job_title);
    const [email, setEmail] = useState(props.customer.email);
    const [phone, setPhone] = useState(props.customer.phone);
    const [department, setDepartment] = useState(props.customer.department);
    const [organisation, setOrganisation] = useState(props.customer.organisation);
    const [tag, setTag] = useState(props.customer.tag);
    const [gender, setGender] = useState(props.customer.gender);

    // For enumerating organisations and departments
    const [allOrgs, setAllOrgs] = useState([]);
    const [allDepts, setAllDepts] = useState([]);

    useEffect(() => {
        refreshData(setAllOrgs, setAllDepts);
    }, [] /* Empty array means only run on mount */)

    // Also a little bit gross but I think the best way to do this
    const handleChange = (e) => {
        let {name, value} = e.target;
        console.log(e);
        switch (name) {
            case 'description':
                console.log("Matched Description")
                setDescription(value);
                break;
            case 'photo':
                value = e.target.files[0];
                setPhoto(value);
                break;
            case 'first_name':
                console.log("Matched First_Name")
                setFirst_name(value);
                break;
            case 'last_name':
                setLast_name(value);
                break;
            case 'job_title':
                setJob_title(value);
                break;
            case 'email':
                setEmail(value);
                break;
            case 'phone':
                setPhone(value);
                break;
            case 'department':
                setDepartment(value);
                break;
            case 'organisation':
                setOrganisation(value);
                break;
            case 'tag':
                setTag(value);
                break;
            case 'gender':
                setGender(value);
                break;
            default:
                console.log(`Error ${name} not a recognised case`);

        }
    }

    const handleSave = () => {
        let data = {
            description: description,
            photo: getPhotoForSubmission(props.newCustomer, photo),
            first_name: first_name,
            last_name: last_name,
            job_title: job_title,
            email: email,
            phone: phone,
            department: department,
            organisation: organisation,
            tag: tag,
            gender: gender,
        };

        props.handleSubmit('customers', data);
    } 

    const organisationSelection = () => {
        return allOrgs.map((org) => (
            <option value={org.id}>{org.name}</option>
        ));
    }

    const departmentSelection = () => {
        return allDepts.map((dept) => (
            <option value={dept.id}>{dept.name}</option>
        ));
    }

    return (
        <Container>
            <button className="" onClick={() => {console.log(editable); setEditable(true); console.log(editable)}}> edit </button>
            <body>
                <Form>
                    <FormGroup>
                        <Label for="description">Description</Label>
                        <Input
                            disabled={! editable}
                            type="text"
                            name="description"
                            value={description}
                            onChange={handleChange}
                            placeholder="Enter Customer Description"
                            className = {styles.customerInput}
                        />
                    </FormGroup>
                    <FormGroup>
                        {props.newCustomer ? (
                            <div>
                                <Label for="photo">photo</Label>
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
                        <Label for="first_name">First Name</Label>
                        <Input
                            disabled={! editable}
                            type="text"
                            name="first_name"
                            value={first_name}
                            onChange={handleChange}
                            placeholder="Enter First Name"
                            className = {styles.customerInput}
                        />
                    </FormGroup>
                    <FormGroup>
                        <Label for="last_name">Last Name</Label>
                        <Input
                            disabled={! editable}
                            type="text"
                            name="last_name"
                            value={last_name}
                            onChange={handleChange}
                            placeholder="Enter Last Name"
                            className = {styles.customerInput}
                        />
                    </FormGroup>
                    <FormGroup>
                        <Label for="job_title">Job Title</Label>
                        <Input
                            disabled={! editable}
                            type="text"
                            name="job_title"
                            value={job_title}
                            onChange={handleChange}
                            placeholder="Blank if Not Applicable"
                            className = {styles.customerInput}
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
                        <Label for="phone">Phone No.</Label>
                        <Input
                            disabled={! editable}
                            type="text"
                            name="phone"
                            value={phone}
                            onChange={handleChange}
                            placeholder="0410123456"
                            className = {styles.customerInput}
                        />
                    </FormGroup>
                    <FormGroup>
                        <Label for="department">Department</Label>
                        <br/>
                        <select 
                            disabled={! editable}
                            name = "department"
                            value={department}
                            onChange={handleChange}
                            placeholder="Select a Department">
                            {departmentSelection()}
                        </select>
                    </FormGroup>
                    <FormGroup>
                        <Label for="organisation">Organisation</Label>
                        <br/>
                        <select 
                            className = {styles.selectButton}
                            disabled={! editable}
                            name = "organisation"
                            value={organisation}
                            onChange={handleChange}
                            placeholder="Select an Organisation">
                        {organisationSelection()}  
                        </select>
                    </FormGroup>
                    <FormGroup>
                        <Label for="tag">Tags</Label>
                        <br/>
                        <Input
                            disabled={! editable}
                            type="Text"
                            name="tag"
                            value={tag}
                            onChange={handleChange}
                            placeholder="Eg; #construction"
                            className = {styles.customerInput}
                        />
                    </FormGroup>
                    <FormGroup>
                        <Label for="gender">Gender</Label>
                        <br/>
                        <select onChange={handleChange}
                                disabled={! editable}
                                value={gender}>
                            <option value="M">Male</option>
                            <option value="F">Female</option>
                            <option value="N">Non-Binary</option>
                            <option value=''>Not Applicable</option>
                        </select>
                    </FormGroup>
                </Form>
            </body>
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

function refreshData(setOrgs, setDepts) {
    axios.get(process.env.REACT_APP_BACKEND_URL + `/app/departments/`, getAuthheader())
        .then((res) => setDepts(res.data.results))
        .catch((err) => console.log(err));

    axios.get(process.env.REACT_APP_BACKEND_URL + `/app/organisations/`, getAuthheader())
        .then((res) => setOrgs(res.data.results))
        .catch((err) => console.log(err));
}

function getPhotoForSubmission(newCustomer, photo) {

    if(newCustomer) {
        return photo;
    } else {
        return '';
    }
}
