import algoliasearch from 'algoliasearch';
const client = algoliasearch(process.env.ALGOLIA_APP_ID, process.env.ALGOLIA_ADMIN_API_KEY);
const index = client.initIndex('Products');
const aa = require("search-insights");

const resultHit = hit => {
  hit.categories.forEach((cameraItem) => {
    if (cameraItem === 'Cameras & Camcorders') {
      let objectID = hit.objectID
      let discountAmount = hit.price - (hit.price * 0.2)
      let salePrice = Math.floor(+discountAmount) + '.00'
//////////////The saveObjects() method breaks on refresh while the
//////////////partialUpdateObjects() method works everytime, yet decrements the
//////////////price with every refresh. Neither method works on load. I can't
//////////////seem to get the salePrice to apply to the entire array of camera
//////////////items on the first load. It seems an item must be viewed before
//////////////the original price is adjusted to the sale price.

//////////////I do very much realize that the partialUpdatObjects() method is
//////////////not the correct method here, however I wanted to demonstrate the
//////////////transformed data being sent successfgully back to Algolia and
//////////////subsequently rendered.

//////////////Additionally, I want to make mention of the lack of both click
//////////////and conversion events. I was having a heck of a time! My attempt
//////////////entailed grabbing the objectID and pulgging that into my
//////////////sendEvents().

//////////////I certainly would've like to complete more of the tasks and
//////////////find that I'm juuuust starting to wrap my head around what's
//////////////required for events. I plan to continue tinkering with both the
//////////////API and middleware -- see which one I can get working first...
//////////////then do it again using the other method. :)

    aa('init', {
      appId: process.env.ALGOLIA_APP_ID,
      apiKey: process.env.ALGOLIA_API_KEY
    })

    aa('sendEvents', [
    {
      userToken: "user-1", 
      index: process.env.ALGOLIA_INDEX,
      eventName: 'sale_item_view',
      objectIDs: [objectID]
      }
    ]);

//set custom ranking & sorting
    index.setSettings({
      customRanking: [
        'desc(popularity)',
        'desc(brand)',
        'desc(rating)'
      ]
      }).then(() => {
        //done
      });

      // index.saveObjects([{
      index.partialUpdateObjects([{
        price: salePrice,
        objectID: objectID
      }]).then((objectID) => {
        console.log('new objects ', objectID)
        console.log(hit.price)
      });
    }
  });
  return (`
    <a class="result-hit">
      <div class="result-hit__image-container">
        <img class="result-hit__image" src="${hit.image}" />
      </div>
      <div class="result-hit__details">
        <h3 class="result-hit__name">${hit._highlightResult.name.value}</h3>
        <p class="result-hit__price">$${hit.price}</p>
      </div>
      <div class="result-hit__controls">
        <button id="view-item" class="result-hit__view">View</button>
        <button id="add-to-cart" class="result-hit__cart">Add To Cart</button>
      </div>
    </a>
`)};

export default resultHit;
