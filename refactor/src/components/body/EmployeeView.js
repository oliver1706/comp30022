import React from 'react'
import styles from "../../css/home.module.css"

export function EmployeeView(props) {


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
                {renderEmployees({editItem: props.editItem, dataList: props.dataList,})}
            </ul>
            <button onClick={prevPage} className={styles.button}>Prev</button>
            <button onClick={nextPage} className={styles.button}>Next</button>
        </div>
    )
}



function renderEmployees(props) {

    return props.dataList.map((employee) => (
        <li
            key={employee.id}
            className = {styles.customer}
            onClick={() => props.editItem(employee)}
        >
            <div className={styles.parent}>
                <span className={styles.name}> {employee.first_name} {employee.last_name} </span>
            </div>
            
            <span className={styles.secondaryText}> {employee.job_title} </span>
            
            <div>
                <img className={styles.customerImage} src={employee.photo} height={44} width={44}/>
            </div>
        </li>
    ))
}