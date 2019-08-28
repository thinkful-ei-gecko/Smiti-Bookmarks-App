/* global store api */
//eslint-disable-next-line no-unused-vars
const bookmarkApp = (function() {
  function showMySavedBookmark(bookmark) {
    const myBookmarkRating = showMyBookmarkRating(bookmark.rating);
    let expand = '';
    
    if (bookmark.id === store.expand) {
      expand =`
        <p class="bookmark-description">${bookmark.desc}</p>
        <a class="bookmark-visit" aria-label="Visit Website" href="${bookmark.url}">Visit Website: ${bookmark.url}</a>
        <div class="bookmark-buttons">  
          <button class="bookmark-delete">Delete</button>
        </div>
      `;
    }

    return `
      <li class="bookmark-list-item" data-id="${bookmark.id}">
        <a href="#" role="button">
          <h2 class="bookmark-title">${bookmark.title}</h2>
          <span class="bookmark-rating" aria-label="${bookmark.rating} star rating">${myBookmarkRating}</span>
        </a>
        ${expand}
      </li>
    `;
  }

  function showMyBookmarkRating(bookmarkRating) {
    switch (bookmarkRating) {
    case 5: 
      return '<span class="yellow">★★★★★</span>';
    case 4:
      return '<span class="yellow">★★★★</span><span class="black">★</span>';
    case 3: 
      return '<span class="yellow">★★★</span><span class="black">★★</span>';
    case 2: 
      return '<span class="yellow">★★</span><span class="black">★★★</span>';
    case 1:
      return '<span class="yellow">★</span><span class="black">★★★★</span>';
    default:
      return '<span class="yellow">★★★★★</span>';
    }
  }



  function showRatingList(filter) {
    return `
      <label for="rating-filter" name="rating-filter" class="hidden">Rating filter</label>
      <select name="rating-filter" id="rating-filter" class="rating-filter">
        <option value="0"  aria-label="Select minimum rating" ${filter === 0 ? 'selected="true"' : ''}>Minimum Rating</option>
        <option value="5" aria-label="5 stars only" ${filter === 5 ? 'selected="true"' : ''}>★★★★★</option>
        <option value="4" aria-label="4 stars and up" ${filter === 4 ? 'selected="true"' : ''}>★★★★☆</option>
        <option value="3" aria-label="3 stars and up" ${filter === 3 ? 'selected="true"' : ''}>★★★☆☆</option>
        <option value="2" aria-label="2 stars and up" ${filter === 2 ? 'selected="true"' : ''}>★★☆☆☆</option>
        <option value="1" aria-label="1 star and up" ${filter === 1 ? 'selected="true"' : ''}>★☆☆☆☆</option>
      </select>
      
      <button class="add-bookmark">Add Bookmark</button>
    `;
  }

  function showAddListHtml() {
    return `
    <div class="add-bookmark-form">
      <h4 tabindex="0">Add Bookmark</h1>
      <label for="bookmark-title">Title</label>
      <input type="text" name="title" aria-label="bookmark-title" placeholder="Title">
      <label for="bookmark-url">Enter an URL:</label>
      <input type="url" name="url" aria-label="bookmark-url" placeholder="Website url">
      <label for="bookmark-description">Description</label>
      <textarea name="desc" class="bookmark-description" aria-label="bookmark-description" placeholder="Enter a description"></textarea>
      <div class=rating-input>
        <label for="rating" id="rating" class="rating">Rating</label>
        <div class="rating" role="radiogroup" aria-labelledby="rating">
          <label>
            <input type="radio" role="radio" name="rating" value="1"><span class="icon">★</span> 
          </label>
          <label>
            <input type="radio" role="radio" name="rating" value="2"><span class="icon">★★</span>
          </label>
          <label>
            <input type="radio" role="radio" name="rating" value="3"><span class="icon">★★★</span>
          </label>
          <label>
            <input type="radio" role="radio" name="rating" value="4"><span class="icon">★★★★</span>
          </label>
          <label>
            <input type="radio" role="radio" name="rating" value="5" checked="checked"><span class="icon">★★★★★</span>
          </label>
        </div>
      </div>
      
      <button type="submit" class="add-bookmark-button">Submit</button>
      <button type="button" class="add-bookmark-button" id="cancel">Cancel</button>
    </div>
    `;
  }



  function showAlertMessageBox() {
    let pageName = '';
    if (store.adding) {
      pageName = 'Add bookmark page';
    } else {
      pageName = 'Bookmark list page';
    }

    let errorMessage = '';
    if (store.error) errorMessage = `<p class="error-message">${store.error}</p>`;
    
    let successMessage = '';
    if (store.success) successMessage = `<p class="hidden">${store.success}</p>`;
    return `
      ${errorMessage}
      ${successMessage}
      <p class="hidden">${pageName}</p>
    `;
  }

  function renderMyBookmark() {
    const listFormHtml = store.adding ? '' : showRatingList(store.filter);
    const alertMessageHtml = showAlertMessageBox();

    let modifyListHtml = '';
    if (store.adding) {
      modifyListHtml = showAddListHtml();
    } 

    const filteredList = store.mylist.filter(bookmark => bookmark.rating >= store.filter);
    const listHtml = store.adding ? '' : filteredList.map(showMySavedBookmark).join('');


    $('aside').html(alertMessageHtml);
    $('.options').html(listFormHtml);
    $('.bookmark-list').html(listHtml);
    if (!store.error) {
      $('.addbookmark-form').html(modifyListHtml);
    }
  }

  function myBookmarkSavedClick() {
    $('.bookmark-list').on('click ', '.bookmark-list-item', function(e) {
      e.preventDefault();
      const id = $(this).attr('data-id');
      store.changeExpand(id);
      store.resetSuccess();
      renderMyBookmark();
    });
  }

  function myBookarkRatingChange() {
    $('.options').on('change', '#rating-filter', function() {
      const selected = $(this).val();
      store.changeFilter(selected);
      store.resetSuccess();
      renderMyBookmark();
    });
  }

  function myBookmarkRemoveButton() {
    $('.bookmark-list').on('click', '.bookmark-delete', function(e) {
      e.stopPropagation();
      const id = $(this).closest('.bookmark-list-item').attr('data-id');
      api.deleteMyBookmark(id, function() {
        store.findAndDelete(id);
        store.setSuccess('One of my Bookmark has been deleted');
        renderMyBookmark();
      });
    });
  }

  function myBookmarkVisitLink() {
    $('.bookmark-list').on('click', '.bookmark-visit', function(e) {
      e.stopPropagation();
    });
  }



  function myBookmarkAddButton() {
    $('.options').on('click', '.add-bookmark', function(e) {
      e.preventDefault();
      store.toggleAdding();
      store.changeExpand(null);
      store.resetSuccess();
      store.resetError();
      renderMyBookmark();
    });
  }



  function myBookmarkCancelButton() {
    $('.addbookmark-form').on('click', '#cancel', function() {
      if (store.editing) store.clearEditing();
      if (store.adding) store.toggleAdding();
      store.resetSuccess();
      store.resetError();
      renderMyBookmark();
    });
  }

  function displayError(error) {
    const errorMessage = error.responseJSON.message;
    store.setError(errorMessage);
    renderMyBookmark();
  }

  function myBookmarkSubmitButton() {
    $('.addbookmark-form').on('submit', function(e) {
      e.preventDefault();
      if (store.adding) {
        const newBookmark = $(this).serializeJson();
        api.addMyBookmark(newBookmark, function(response) {
          store.addMyBookmark(response);
          store.toggleAdding();
          store.setSuccess('One of my Bookmark has been added');
          store.resetError();
          renderMyBookmark();
        }, displayError);
      } 
    });
  }

  function handleMyBookmark() {
    myBookmarkSavedClick();
    myBookarkRatingChange();
    myBookmarkRemoveButton();
    myBookmarkAddButton();
    myBookmarkCancelButton();
    myBookmarkSubmitButton();
    myBookmarkVisitLink();
    
    
  }

  return {
    renderMyBookmark,
    handleMyBookmark
  };
}());



/* global api store bookmarkApp*/
$(function() {
  api.getMyBookmarks(response => {
    response.forEach(bookmark => {
      store.addMyBookmark(bookmark);
    });
    bookmarkApp.renderMyBookmark();
  });
  bookmarkApp.handleMyBookmark();
});