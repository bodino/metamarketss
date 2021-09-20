import React from "react"
import Marketitem from "./Marketitem"
import {Link} from 'react-router-dom'

import { useLocation } from 'react-router-dom'

export function MarketGrid({items ,isLoading}) {

    var frodo = '/market'
    
    return isLoading ? (<h1></h1>) :     
    <section className="cards"> 
        {items.map((item) =>(

            
        <Link className="MarketBoxText"  to={{ 
            pathname: frodo, state: {fromDashboard: item}, 
            }}> 
            
            <Marketitem key={item.char_id} item={item}></Marketitem>
           
  
        </Link>


        ))}
    </section>

}
export default MarketGrid