import React, {useState, useEffect} from "react"
import { Form, FormGroup, Modal, ModalHeader, ModalBody, ModalFooter, Button, Input, Label, Container } from "reactstrap"
import styles from '../../css/advancedSearch.module.css'
import modalStyles from '../../css/addCustomer.module.css'
import searchStyle from '../../css/home.module.css'
import lodash from "lodash"
export function SearchBar(props) {

    const [currSearch, setCurrSearch] = useState(props.search)
    const [ordering, setOrdering] = useState(props.ordering)
    const [previewSearch, setPreviewSearch] = useState("")
    const [orderingToggle, setOrderingToggle] = useState(false)
    useEffect(() => {
        props.updateSearch(currSearch)
    }, [currSearch])

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(e);
        let value = e.target.value;
        console.log(value)

        /* Format for a proper search string */
        console.log(currSearch)
        console.log("Bananananana")
        console.log(previewSearch)
        console.log(value);
        setCurrSearch(previewSearch)
        
    }

    const updatePreview = (e) => {
        setPreviewSearch(e.target.value);
    }

    const submitSearch = (e) => { 
        setCurrSearch(e.target.value)
    }

    return (
        <div>
            <Form
                onSubmit={e => { handleSubmit(e) }}
            >
                <Input
                    type="text"
                    name="search"
                    value={previewSearch}
                    onChange={updatePreview}
                    placeholder = 'Search'
                    className = {searchStyle.inputBox}
                />
                {orderingToggle ? 
                    null/*<OrderingForm
                        isOpen={orderingToggle}
                        toggle={() => {setOrderingToggle(! orderingToggle); console.log(orderingToggle)}}
                        setOrdering={props.setOrdering} 
                    />*/
                    :
                    null}
           
            </Form>
            

        </div>
    )
}

export function AdvancedSearch(props) {

    const [searchFields, setSearchFields] = useState(props.allFields.map((field) => ""))
    
    useEffect(() => {
        console.log(searchFields)
    }, [searchFields])

    const generateSearchString = () => {
        let searchString = ""
        for(let i = 0; i < props.allFields.length; i++) {
            if(searchFields[i]) {
                searchString = `${searchString}&${props.allFields[i]}=${searchFields[i]}`
            }
        }
        return searchString
    }

    const handleSubmit = () => {

        const searchString = generateSearchString();
        props.updateSearch(searchString);
        props.toggle();
    }
    
    const handleChange = (e) => {

        let index = props.allFields.indexOf(e.target.name);
        let newString = e.target.value;

        let newFields = lodash.cloneDeep(searchFields); // Otherwise it all goes to hell
        newFields[index] = newString;

        setSearchFields(newFields);

    }

    const renderFields = () => {

        let allFields = props.allFields

        let currFields = searchFields
        return allFields.map((field) => (
            <FormGroup>
                <Label className={styles.fieldLabel} for={field}>{humanise(field)}</Label>
                <Input className={styles.customerInput}
                    type="text"
                    name={field}
                    value={currFields[allFields.indexOf(field)]}
                    onChange={handleChange}
                    placeholder={humanise(field)}
                />
            </FormGroup>
        ))
    }

    return (
        <Modal className = {styles.popup} isOpen={true} toggle={props.toggle}>
            <h2 className = {styles.header}toggle={props.toggle} >Advanced Search 
            <Button
            className = {styles.closeButton}
            >Close
            </Button>
            </h2>
            <ModalBody>
                <Form onSubmit={e => { e.preventDefault() }}>
                {renderFields()}
                </Form>
            </ModalBody>
            <ModalFooter className = {styles.foot}>
                <Button
                className = {styles.searchButton}
                color="success"
                onClick={() => handleSubmit()}
                
                >
                Search
                </Button>
            </ModalFooter>
        </Modal>
    )


}

export function OrderingForm(props) {
    
    const [orderSelection, setOrderSelection] = useState("default")

    const handleChange = (e) => {
        let value = e.target.value;
        setOrderSelection(value);
        props.setOrdering(value);
    }

    const generateSelection = () => {
        const orderingFields = ['default',
            'first_name', 
            'last_name', 
            'average_invoice', 
            'total_invoice',
            'total_overdue']

        return orderingFields.map((field) => (
            <option value={field}>{humanise(field)}</option>
        ));
    }

    return (
        <Container isOpen={props.isOpen} toggle={props.toggle} className={modalStyles.customerPopup}>
            <header className = {modalStyles.header} toggle={props.toggle}> Order By
                <button onClick={props.toggle}>Close</button>
            </header>

                <Form>
                    <FormGroup>
                        <select
                            className={modalStyles.selectButton}
                            name="ordering"
                            value={orderSelection}
                            onChange={handleChange}
                            placeholder="Order by...">
                                {generateSelection()}
                        </select>
                    </FormGroup>
                </Form>

        </Container>
    )
}
function humanise(str) {
    var i, frags = str.split('_');
    for (i=0; i<frags.length; i++) {
      frags[i] = frags[i].charAt(0).toUpperCase() + frags[i].slice(1);
    }
    return frags.join(' ');
}