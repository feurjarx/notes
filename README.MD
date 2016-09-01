# Notes
### Js-note: Property Advantage in Jquery
```js
// Property code style
Object.defineProperty(window, 'more_actions_text', {
    get: function () {
        return $('#more-actions-btn').text();
    },
    set: function (v) {
        $('#more-actions-btn').text(v);
    }
});

/* Property code style (Arrow style)

 Object.defineProperty(window, 'more_actions_text', {
    get: () => $('#more-actions-btn').text(),
    set: (v) => $('#more-actions-btn').text(v)
 });
 */

more_actions_text = 1;

// Simple style througth jQuery
$('#more-actions-btn').text(1)
```

### PHP-note: use mongo cursor
```PHP
$alertCollection = MongoRecordPeer::collection('alert');

$cursor = $alertCollection->find([
    'callout_id' => [
        '$in' => $expiredOpportunitiesIds
    ]
]);

foreach ($cursor as $alertDocument) {
    $alertCollection->remove(['_id' => $alertDocument['_id']]);
    
    $removedCounter++;
}
```
