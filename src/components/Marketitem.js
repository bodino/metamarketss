import React from 'react'
import '../App.css'
import { Card } from 'react-bootstrap';
import { Button } from 'react-bootstrap';


export function Marketitem({item}) {
    return(  
   
    <Card border="warning" style={{ width: '16rem' ,height:'12rem'}}>
  <Card.Img className="card-img" variant="bottom" src={item.image}  />
  <Card.Body className="MarketBoxText">
    <Card.Subtitle className="MarketBoxText">{(item.question.toString())}</Card.Subtitle>
    <Card.Text className="yestext">
       {item.outcomes[0]}: {Math.round(item.outcomePrices[0]*100)/100} USD

     <Card.Text>
         {item.outcomes[1]}: {Math.round(item.outcomePrices[1]*100)/100} USD
    </Card.Text>
    </Card.Text>
  </Card.Body>
</Card>


    
  )
}

export default Marketitem
