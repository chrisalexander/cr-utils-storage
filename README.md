# cr.utils.storage

Helper services for working with the Chrome storage APIs

## Interface

The interface matches that for the [standard Chrome API](https://developer.chrome.com/apps/storage#type-StorageArea).

However, instead of providing a callback function, provide the other arguments
then a $q promise is returned, which is resolved with the result if successful
or the error raised with the last error as the argument.

## Events

**All** events are fired for each change, so if you subscribe to multiple,
they will all be triggered for just a single change.

### cr.utils.storage.changed

This event is emitted when any key in any of the storage mechanisms are changed.

The two arguments in the event are the *namespace* of the event ("local",
"sync", or "managed" etc.) and the list of changes.

### cr.utils.storage.[namespace]

For each of the *namespaces*, an event is dispatched when a key in that
namespace is modified.

These events, which allow you to subscribe to changes for a specific namespace
only, have only one argument which is the list of changes.

### cr.utils.storage.[key]

For each of the changed *keys* in all *namespaces*, an event is dispatched when
that specific key in any namespace is modified.

The two arguments to the event are the *namespace* of the event, and the
specific *change object* for the change that occurred.

### cr.utils.storage.[namespace].[key]

This event is dispatched when the *key* in the specific *namespace* is modified.

The only argument to this event is the *change object* for the change that
occurred.