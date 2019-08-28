
//eslint-disable-next-line no-unused-vars
const api = (function() {
  const BASE_URL = 'https://thinkful-list-api.herokuapp.com/smiti';
  
  const getMyBookmarks = function(callback) {
    $.getJSON(BASE_URL + '/bookmarks', callback);
  };

  const deleteMyBookmark = function(id, callback) {
    $.ajax({
      url: BASE_URL + '/bookmarks/' + id,
      method: 'DELETE',
      success: callback
    });
  };

  const addMyBookmark = function(newBookmark, callback, errorCallback) {
    $.ajax({
      url: BASE_URL + '/bookmarks',
      method: 'POST',
      contentType: 'application/json',
      data: newBookmark,
      success: callback,
      error: errorCallback
    });
  };

  const editMyBookmark = function(id, updatedBookmark, callback, errorCallback) {
    $.ajax({
      url: BASE_URL + '/bookmarks/' + id,
      method: 'PATCH',
      contentType: 'application/json',
      data: updatedBookmark,
      success: callback,
      error: errorCallback
    });
  };

  return {
    getMyBookmarks,
    deleteMyBookmark,
    addMyBookmark,
    editMyBookmark
  };
}());