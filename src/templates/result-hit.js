import algoliasearch from 'algoliasearch';
const client = algoliasearch(process.env.ALGOLIA_APP_ID, process.env.ALGOLIA_ADMIN_API_KEY);
const index = client.initIndex('Products');

const resultHit = hit => {
  hit.categories.forEach((cameraItem) => {
    if (cameraItem === 'Cameras & Camcorders') {
      let objectID = hit.objectID
      let discountAmount = hit.price - (hit.price * 0.2)
      let salePrice = Math.floor(+discountAmount) + '.00'
//////////////The saveObjects() method breaks on refresh while the
//////////////partialUpdateObjects() method works everytime, but decrements the
//////////////price with every refresh. Neither method works on load. I can't
//////////////seem to get the salePrice to apply to the entire array of camera
//////////////items and have yet to find a pattern as to why some pages show
////////////// adjusted prices while other pages remain as the original price.

//////////////I do very much realize that the partialUpdatObject() method is
//////////////not the correct method here, however I wanted to demonstrate the
//////////////transformed data being sent successfgully back to Algolia and
//////////////subsequently rendered.

// index.saveObjects([{
      index.partialUpdateObjects([{
        price: salePrice,
        objectID: objectID
      }]).then((objectID) => {
        console.log('new objects ', objectID)
        console.log(hit.price)
      });

      // index.partialUpdateObject({
      //   price: salePrice,
      //   objectID: objectID
      // }).then(( objectID ) => {
      //   console.log(objectID);
      //   console.log(hit.price);
      // });

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
