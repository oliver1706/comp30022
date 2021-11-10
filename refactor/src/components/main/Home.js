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
import { SearchBar, AdvancedSearch, OrderingForm} from '../body/SearchBar'
import { InspectCustomer } from '../body/InspectCustomer';
import { CreateOrgOrDept } from '../body/CreateOrgOrDept';
import { ImportData } from '../body/ImportData';
import { orderBy } from 'lodash';

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
    const [ordering, setOrdering] = useState(false);
    const [orderByToggle, setOrderByToggle] = useState(false); // For the  ordering "pop up"

    

    useEffect(() => {
        loadPage("CustomerView")
    }, [])

    useEffect(() => {
        //Refresh the list
        setData({results: []})
        const [tempSelection, tempSearch, tempSort] = [selection, search, sort]
        refreshList(acceptResponse, tempSelection, ordering, tempSearch, advancedSearch, tempSort, pageNum);

    }, [search, page, sort, ordering, pageNum, selection, test/*Just to make life easy */]) //The list at the end stops this being called if the things haven't changed

    function loadPage(page) {
        setSelection(getSelection(page));
        setSearch("");
        setSort("");
        
        //dataList hopefully updated by useEffect
        setPage(page);
        //Unecessary but a little helpful for testing:

    }

    function acceptResponse(res) {

        setData(res.data)

    }

    function updateAdvancedSearch(searchString) {
        setAdvancedSearch(searchString);
    }
    function updateOrdering(orderBy) {

        if(orderBy === 'default') {
            setOrdering(false)
        } else {
            setOrdering(orderBy);
        }

    }

    function updateSearch(search) {
        setAdvancedSearch(false);
        setSearch(search);
    }

    const editCustomer = (customer) => {

        setActiveItem(customer);
        loadPage("EditCustomer")
    }

    const newItem = () => {
        switch(selection) {
            case "customers":
                createCustomer();
                break;
            case "employees":
                createEmployee();
                break;

        }
    }

    const editEmployee = (employee) => {
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
                return (
                    <div>
                        <div className = {styles.search}> 
                        <SearchBar
                            search={search}
                            updateSearch={updateSearch}
                            className = {styles.inputBox}
                            setOrdering={updateOrdering}
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
                            orderByToggle={orderByToggle}
                            setOrderByToggle={setOrderByToggle}
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
            case "CreateOrgOrDept":
                return (
                    <div>
                        <CreateOrgOrDept/>
                    </div>
                )
            case "ImportData":
                return (
                    <div>
                        <ImportData/>
                    </div>
                )
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
            handleClose={() => {setMenuToggle(false)}} 
            visibility={menuToggle}
            openCustomers={() => loadPage("CustomerView")}
            openEmployees={() => loadPage("EmployeeView")}
            createOrgOrDept={() => loadPage("CreateOrgOrDept")}
            importData={() => loadPage("ImportData")}
        />
        
        {advancedSearchToggle ? (
            <AdvancedSearch
                allFields={getAllFields('customers')}
                updateSearch={setAdvancedSearch}
                toggle={() => {setAdvancedSearchToggle(false)}}
                idOpen={advancedSearchToggle}
            />
        ) : (orderByToggle ? <OrderingForm isOpen={orderByToggle} toggle={() => {setOrderByToggle(! orderByToggle)}} setOrdering={setOrdering}/> : renderBody(page))}
        
        {null}
    </section>
    )
}
