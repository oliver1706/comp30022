//Encapsulates the page for our app

//Delegates rendering and functionality of the header menu and body to other functions
// which are imported.

//This delegation amkes it easier to update the functionality/looks of the app.

//Additionally the switch to functions should make the app work much more smoothly

import styles from '../../css/home.module.css'

import {Header} from'../header/Header.js'
import {CustomerView} from '../body/CustomerView.js'
import {Menu} from '../menu/Menu.js';
import {
    refreshList, 
    newCustomer,
    newEmployee,
    handleSubmit, 
    getSelection,
    getAllFields,
    } from './Util.js'
import React, { Redirect, Component, useState, useEffect } from 'react';
import { EditCustomer } from '../body/EditCustomer';
import { EmployeeView } from '../body/EmployeeView';
import { EditEmployee } from '../body/EditEmployee';
import { SearchBar, AdvancedSearch} from '../body/SearchBar'
import { InspectCustomer } from '../body/InspectCustomer';

export default function Home(props) {
    //State hook stuff
    const [test, setTest] = useState(0);
    const [selection, setSelection] = useState("customers");
    const [data, setData] = useState(false);
    const [search, setSearch] = useState("");
    const [advancedSearch, setAdvancedSearch] = useState(false)
    const [advancedSearchToggle, setAdvancedSearchToggle] = useState(false)
    const [sort, setSort] = useState("");
    const [menuToggle, setMenuToggle] = useState(false);
    const [activeItem, setActiveItem] = useState(false);
    const [pageNum, setPageNum] = useState(1); // For Pagination of requests
    const [page, setPage] = useState("CustomerView"); // For Loading different body elements, use loadpage to change

    

    useEffect(() => {
        loadPage("CustomerView")
    }, [])

    useEffect(() => {
        //Refresh the list
        setData({results: []})
        console.log("Use effect called");
        const [tempSelection, tempSearch, tempSort] = [selection, search, sort]
        refreshList(acceptResponse, tempSelection, tempSearch, advancedSearch, tempSort, pageNum);
        console.log(data.results);

    }, [search, page, sort, pageNum, selection, test/*Just to make life easy */]) //The list at the end stops this being called if the things haven't changed

    function loadPage(page) {
        console.log(`Setting to ${page}`)
        setSelection(getSelection(page));
        setSearch("");
        setSort("");
        
        //dataList hopefully updated by useEffect
        setPage(page);
        //Unecessary but a little helpful for testing:
        setTest(0);

    }

    function testLog(e){
        console.log(test);
        setTest(test + 1)
    }

    function acceptResponse(res) {
        // Searching throws out a new request on every key press.
        // Sometimes they arrive out of order, ruining the searchbar!
        // This verifies that the responses url is equivalent to the most recent one
        // before updating dataList

        // This does not  work. I think when the axios request finishes, the values for
        // state are locked already locked in. Unsure how to fix but definitely needs to be
        // Possible solution: https://stackoverflow.com/questions/68947742/get-axios-responses-in-the-same-order-as-requests-for-search-functionality
        console.log(res)
        if(res.config.url === (process.env.REACT_APP_BACKEND_URL + `/app/${selection}/?page=${pageNum}&search=${search}&${sort}`)) {
            setData(res.data);
            console.log(search)
            console.log(res.config.url)
            console.log(process.env.REACT_APP_BACKEND_URL + `/app/${selection}/?page=${pageNum}&search=${search}&${sort}`)
        } else {
            //Reject >:(
            console.log("Old response received")
        }
    }

    function updateAdvancedSearch(searchString) {
        setAdvancedSearch(searchString);
    }

    function updateSearch(search) {
        setAdvancedSearch(false);
        setSearch(search);
    }

    const editCustomer = (customer) => {
        console.log(customer)
        setActiveItem(customer);
        loadPage("EditCustomer")
    }

    const newItem = () => {
        switch(selection) {
            case "customers":
                console.log(`Selection was `)
                createCustomer();
                break;
            case "employees":
                createEmployee();
                break;
            default:
                console.log(`Unexpected selection ${selection}`)

        }
    }

    const editEmployee = (employee) => {
        console.log(employee);
        console.log("Juniper")
        setActiveItem(employee);
        loadPage("EditEmployee");
    }
    
    const createCustomer = () => {
        setActiveItem(false);
        loadPage("EditCustomer")
    }

    const createEmployee = () => {
        setActiveItem(false);
        loadPage("EditEmployee")
    }

    function renderBody(page) {
        if(data) {
        switch (page) {

            case "CustomerView":
                console.log(data);
                return (
                    <div>
                        <div className = {styles.search}> 
                        <SearchBar
                            search={search}
                            updateSearch={updateSearch}
                            className = {styles.inputBox}
                            placeholder = 'Search'
                        />
                        </div>
                        <div className = {styles.CustomerList}>
                        <CustomerView
                            dataList={data.results}
                            editItem={editCustomer}
                            data={data}
                            setPage={setPageNum}
                            pageNum={pageNum}
                            advancedSearchToggle={advancedSearchToggle}
                            setAdvancedSearchToggle={setAdvancedSearchToggle}
                        />
                        </div>
                    </div>
                );
            case "EditCustomer":
                return (
                    <div>
                        <InspectCustomer
                            customer={(activeItem ? activeItem : newCustomer())}
                            newCustomer={activeItem ? false : true}
                            handleSubmit={handleSubmit}
                            handleClose={() => loadPage("CustomerView")}
                            editable={activeItem ? false : true} // Default to uneditable unless adding a new customer
                        />
                    </div>
                );
            case "EmployeeView":
                console.log(data);
                return (
                    <div>
                        <SearchBar
                            search={search}
                            updateSearch={updateSearch}
                            className = {styles.inputBox}
                            placeholder = 'Search'
                        />
                        <EmployeeView
                            dataList={data.results}
                            editItem={editEmployee}
                            data={data}
                            setPage={setPageNum}
                            pageNum={pageNum}
                            advancedSearchToggle={advancedSearchToggle}
                            setAdvancedSearchToggle={setAdvancedSearchToggle}
                        />
                    </div>
                );
            case "EditEmployee":
                return (
                    <div>
                        <EditEmployee
                            employee={(activeItem ? activeItem : newEmployee())}
                            newEmployee={activeItem ? false : true}
                            handleSubmit={handleSubmit}
                            handleClose={() => loadPage("EmployeeView")}
                            editable={activeItem ? false : true} // Default to uneditable unless adding a new employee
                        />
                    </div>
                );
        }
    } else { return (<div>Loading</div>)}
    }


    // Rendering split into three parts. Body rendering is complicated enough
    //  to justify it's own function. 
    return(
    <section id = 'HomeScreen' className = {styles.homeScreen}>
        <Header
            goHome={() => loadPage("CustomerView")}
            openMenu={() => setMenuToggle(true)}
            addItem={() => newItem()}
        />
        <Menu
            handleClose={() => {setMenuToggle(false); console.log("Closed menu")}} 
            visibility={menuToggle}
            openCustomers={() => loadPage("CustomerView")}
            openEmployees={() => loadPage("EmployeeView")}
        />
        
        {advancedSearchToggle ? (
            <AdvancedSearch
                allFields={getAllFields('customers')}
                updateSearch={setAdvancedSearch}
                toggle={() => {setAdvancedSearchToggle(false)}}
                idOpen={advancedSearchToggle}
            />
        ) : renderBody(page)}
        
        {null}
    </section>
    )
}
