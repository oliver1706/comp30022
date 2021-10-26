import React from 'react'
import styles from "../../css/home.module.css"

export function CustomerView(props) {

    const nextPage = () =>{
        if(props.data.next) {
            props.setPage(props.pageNum + 1)
        }
    }
    
    const prevPage = () =>{
        if(props.data.previous) {
            props.setPage(props.pageNum - 1)
        }
    }

    return(
        <div>
            <button onClick={() => props.setAdvancedSearchToggle(! props.advancedSearchToggle)}>hi</button>
            <ul className={styles.customerList}>
                {renderCustomers({editItem: props.editItem, dataList: props.dataList,})}
            </ul>
            <button onClick={prevPage} className={styles.button}>Prev</button>
            <button onClick={nextPage} className={styles.button}>Next</button>
        </div>
    )

}

function renderCustomers(props) {
    //Taken (with mangled css) from renderItems in Home.js
    
    return props.dataList.map((customer) => (
        <li 
            key={customer.id} 
            onClick={() => props.editItem(customer)}
            className={styles.customer}
        >

            <div className={styles.parent}>
                <span className={styles.name}> {customer.first_name} {customer.last_name} </span>
            </div>
            
            <span className={styles.secondaryText}> {customer.job_title} </span>
            
            <div>
                <img className={styles.customerImage} src={customer.photo} height={44} width={44}/>
            </div>
        
        </li>
    ))
}

