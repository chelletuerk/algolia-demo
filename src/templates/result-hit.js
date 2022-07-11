import algoliasearch from 'algoliasearch';
const client = algoliasearch(process.env.ALGOLIA_APP_ID, process.env.ALGOLIA_ADMIN_API_KEY);
const index = client.initIndex('Products');

const resultHit = hit => {
  hit.categories.forEach((cameraItem) => {
    if (cameraItem === 'Cameras & Camcorders') {
      let objectID = hit.objectID
      let discountAmount = hit.price - (hit.price * 0.2)
      let salePrice = Math.floor(+discountAmount) + '.00'
      let object = { price: salePrice }
      // index.saveObject(object).wait().then(({objectID}) => {
      //   console.log('new object ', object)
      // });

      index.partialUpdateObject({
        price: salePrice,
        objectID: objectID
      }).then(( object ) => {
        console.log(object)
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
