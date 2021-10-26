
import React, {useState, useEffect} from 'react'
import { getAuthheader } from '../main/Util';
import styles from '../../css/infotabs.module.css';
import axios from 'axios'
import {Body} from 'reactstrap'

export function CustomerGraphs(props) {

    const [loadedPlots, setLoadedPlots] = useState(false);
    const [loadedStats, setLoadedStats] = useState(false);
    const [currPlot, setCurrPlot] = useState(null);
    const [plots, setPlots] = useState({});
    const [stats, setStats] = useState({});

    useEffect(() => {
        axios.get(process.env.REACT_APP_BACKEND_URL + `/app/customers/${props.customer.id}/salesplot/`, getAuthheader())
            .then((res) => {setPlots(res.data); setLoadedPlots(true); setCurrPlot(res.data.sum_of_sales_plot)})
            .catch((err) => console.log(err));
  
        axios.get(process.env.REACT_APP_BACKEND_URL + `/app/customers/${props.customer.id}/stats/`, getAuthheader())
            .then((res) => {setStats(res.data); setLoadedStats(true)})
            .catch((err) => console.log(err));
    }, []);

    const updatePlot = (e) => {
        let value = e.target.value;
        setCurrPlot(value);
        return (
          <select onChange={updatePlot} value={currPlot}>
            <option value={plots.sum_of_sales_plot}>Total Spending Per Month</option>
            <option value={plots.mean_of_sales_plot}>Average Spending</option>
            <option value={plots.amount_per_invoices}>Spending per Invoice</option>
          </select>
        )
    
    }
    const plotSelection = () => {
        // Done manually
        return (
            <select onChange={updatePlot} value={currPlot}>
                <option value={plots.sum_of_sales_plot}>Total Spending Per Month</option>
                <option value={plots.mean_of_sales_plot}>Average Spending</option>
                <option value={plots.amount_per_invoices}>Spending per Invoice</option>
            </select>
        )
    
    }
    //const onClose = this.props.onClose;

    if(loadedPlots) {
      return (
        <body>
            <div>
                <div className = {styles.selector} > {plotSelection()} </div>
                <img src={`data:img/png;base64, ${currPlot}`} width={330} height={330}/>
            </div>
          
        </body>
      )
    }
    else {
        return (<div>Loading</div>)
    }

}