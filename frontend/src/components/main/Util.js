import axios from 'axios';

export function refreshList(acceptResponse, selection, ordering, search, advancedSearch, sort, pageNum) {

    //For debugging

    let orderBy = ''
    if(ordering) {
        orderBy = `ordering=${ordering}`;
    }
    

    if(advancedSearch) {
        axios
            .get(process.env.REACT_APP_BACKEND_URL + `/app/${selection}/?page=${pageNum}&${advancedSearch}&${sort}&${orderBy}`, getAuthheader())
            .then((res) => {acceptResponse(res)});
    } else {
        axios
            .get(process.env.REACT_APP_BACKEND_URL + `/app/${selection}/?page=${pageNum}&search=${search}&${sort}&${orderBy}`, getAuthheader())
            .then((res) => {acceptResponse(res)});
    }

}

export function getAuthheader() {
    const key = window.sessionStorage.getItem('key');
    return {headers: {'Authorization': `Token ${JSON.parse(key).key}` }}
}

export function handleSubmit(selection, data) {

    let form = new FormData();

    for (let key in data) {
        if (data[key] == "null" || data[key] == null) {
            form.append(key, '');
        } else {
            form.append(key, data[key]);
        }
    }

    if(form.has('id')) {
        // Patch
        axios
            .patch(process.env.REACT_APP_BACKEND_URL + `/app/${selection}/${form.get('id')}/`, form, getAuthheader());
    } else {
        // Post
        axios
            .post(process.env.REACT_APP_BACKEND_URL + `/app/${selection}/`, form, getAuthheader());
    }
    
}

export function getPage() { // Intended to return the class with props that corresponds to state variables?

}

export function getSelection(page) { // Maps each page to it's relevant database selection 

    switch (page) {
        case "CustomerView":
            return "customers";
        case "EditCustomer":
            return "customers";
        case "EmployeeView":
            return "employees"
        case "EditEmployee":
            return "employees"
        case "CreateOrgOrDept":
            return "customers"
        case "ImportData":
            return "customers"
    }
}

export function getAllFields(selection) {

    switch(selection) {
        case 'customers':
            return ['first_name', 'last_name', 'gender', 'tag', 'email', 'phone']
        case 'employees':
            return ['', 'first_name', 'last_name', 'gender', 'tag', 'email', 'phone']
    }
}

export function newCustomer() {
    return (
        {
            description: "",
            photo: "",
            first_name: "",
            last_name: "",
            job_title: "",
            email: "",
            phone: "",
            department: "",
            organisation: "",
            tag: "",
            gender: "",
            invoices: []
        }
    )
}

export function newEmployee() {
    return (
        {
            username: "",
            first_name: "",
            last_name: "",
            job_title: "",
            phone: "",
            department: "",
        }
    )
}