$.fn.extend({
  serializeJson: function() {
    const formData = new FormData(this[0]);
    const o = {};
    formData.forEach((val, name) => o[name] = val);
    return JSON.stringify(o);
  }
});



//eslint-disable-next-line no-unused-vars
const store = (function() {
  const addMyBookmark = function(bookmark) {
    this.mylist.push(bookmark);
  };

  const changeExpand = function(id) {
    if (this.expand === id) {
      this.expand = null;
    } else {
      this.expand = id;
    }
  };

  const changeFilter = function(minimumRating) {
    this.filter = Number(minimumRating);
  };

  const findAndDelete = function(id) {
    this.mylist = this.mylist.filter(bookmark => bookmark.id !== id);
  };

  const toggleAdding = function() {
    this.adding = !this.adding;
  };


  const findBookmark = function(id) {
    return this.mylist.find(bookmark => bookmark.id === id);
  };

  const setError = function(errorMessage) {
    this.error = errorMessage;
  };

  const resetError = function() {
    this.error = null;
  };

  const setSuccess = function(successMessage) {
    this.success = successMessage;
  };

  const resetSuccess = function() {
    this.success = null;
  };


  return {
    mylist: [],
    adding: false,
    expanded: null,
    filter: 0,
    error: null,
    success: null,

    addMyBookmark,
    changeExpand,
    changeFilter,
    findAndDelete,
    toggleAdding,
    setError,
    resetError,
    setSuccess,
    resetSuccess,
    findBookmark,
  
  };
}());