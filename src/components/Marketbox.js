import React, { useState, useEffect } from 'react'
import axios from 'axios'
import '../App.css'
import MarketGrid from "./MarketGrid"



export function MarketBox() {

  const [items, setItems] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [query, setQuery] = useState('')

  useEffect(() => {
    const fetchItems = async () => {
      setIsLoading(true)
      const result = await axios(
        `https://strapi-matic.poly.market/markets?_limit=-1&closed=false&active=true&market_type=normal`
      )

      console.log("goodbye")

      setItems(result.data)
      setIsLoading(false)
    }

    fetchItems()
  }, [])
return (
    
    <div className="container123">
      
      <MarketGrid isLoading={isLoading} items={items} />
    
    </div>

);

}

export default MarketBox