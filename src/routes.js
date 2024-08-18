const {
  addNewBookHandler,
  getAllBooksHandler,
  getBookByIdHandler,
  editBookByIdHandler,
  deleteBookByIdHandler
} = require('./handler');

const routes = [
  {
    // Add new book
    method: 'POST',
    path: '/books',
    handler: addNewBookHandler
  },
  {
    // Get all books
    method: 'GET',
    path: '/books',
    handler: getAllBooksHandler
  },
  {
    // Get book by id
    method: 'GET',
    path: '/books/{id}',
    handler: getBookByIdHandler
  },
  {
    // Update book data by id
    method: 'PUT',
    path: '/books/{id}',
    handler: editBookByIdHandler
  },
  {
    method: 'DELETE',
    path: '/books/{id}',
    handler: deleteBookByIdHandler
  }
];

module.exports = routes;