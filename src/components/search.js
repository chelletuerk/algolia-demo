const search = instantsearch({
  indexName: 'instant_search',
  searchClient: algoliasearch(
    process.env.ALGOLIA_APP_ID,
    process.env.ALGOLIA_API_KEY
  ),
});

// Add widgets
// ...

search.start();
