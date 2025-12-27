import {propertyForSaleArr as propArr} from '/properties/propertyForSaleArr.js'
import {placeholderPropertyObj as placeholderObj} from '/properties/placeholderPropertyObj.js'


function getPropertyHtml(propArr = [placeholderObj]) {

const html = propArr.map((prop)=>{
    const {image, propertyLocation, priceGBP, roomsM2, comment} = prop
    const totalsqm = prop.roomsM2.reduce((totalsqm, roomM2)=>totalsqm + roomM2,0)
    
    return `<section class="card">
                <img src="/images/${image}">
                <div class="card-right">
                    <h2>${propertyLocation}</h2>
                    <h3>£${priceGBP}</h3>
                    <p>${comment}</p>
                    <h3>${totalsqm} m&sup2;</h3>
                </div>
            </section> `
    }).join('')
    return html
}

/*
SUPER CHALLENGE 💪

Render out a card for each of the properties in the propertyForSaleArr array (in the 'properties' folder). Each card should have an image, a property location, a price, a comment and the TOTAL property size in square metres (each object has an array with the size in square metres of the individual rooms).

If no array of properties is passed to getPropertyHtml, the placeholder property stored in placeholderPropertyObj (in the 'properties' folder) should be rendered instead.

This is the JS I want you to use to complete this challenge 👇
- import/export
- .map() returns a new array populated by provided function, non-mutate
- .join() uses with array and combine all elements with provided separator 
- Object destructuring to not mention object name everytime
- .reduce() sum elements in array
- Default parameters if proivded parameter not empty change default with provided param

The HTML and CSS have been done for you. 
This is the HTML template 👇. Replace everything in UPPERCASE with property data.

<section class="card">
    <img src="/images/IMAGE">
    <div class="card-right">
        <h2>PROPERTY LOCATION</h2>
        <h3>PRICE GBP</h3>
        <p>COMMENT</p>
        <h3>TOTAL SIZE IN SQUARE METRES m&sup2;</h3>
    </div>
</section> 
*/

/***** Modify 👇 by adding an argument to the function call ONLY. *****/
document.getElementById('container').innerHTML = getPropertyHtml(propArr)