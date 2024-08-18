const { nanoid } = require('nanoid');

const books = require('./books');

// Add new book
const addNewBookHandler = (req, h) => {
  const id = nanoid(16);
  const { name, year, author, summary, publisher, pageCount, readPage, reading } = req.payload;
  const finished = readPage === pageCount;
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;

  if (!name) {
    const res = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku'
    });
    res.code(400);
    return res;
  }

  if (readPage > pageCount) {
    const res = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount'
    });
    res.code(400);
    return res;
  }

  const newBook = { id, name, year, author, summary, publisher, pageCount, readPage, finished, reading, insertedAt, updatedAt };

  books.push(newBook);

  const isSuccess = books.filter((book) => book.id === id).length > 0;

  if (isSuccess) {
    const res = h.response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
        bookId: id
      }
    });
    res.code(201);
    return res;
  }

  const res = h.response({
    status: 'fail',
    message: 'Gagal menambahkan buku'
  });
  res.code(500);
  return res;
};

const getAllBooksHandler = (req, h) => {
  const { reading, finished, name } = req.query;

  if (reading === '1') {
    const readingBooks = books.filter((book) => book.reading === true);

    const res = h.response({
      status: 'success',
      data: {
        books: readingBooks.map((book) => ({
          id: book.id,
          name: book.name,
          publisher: book.publisher
        }))
      }
    });
    res.code(200);
    return res;
  } else if (reading === '0') {
    const notReadingBooks = books.filter((book) => book.reading === false);

    const res = h.response({
      status: 'success',
      data: {
        books: notReadingBooks.map((book) => ({
          id: book.id,
          name: book.name,
          publisher: book.publisher
        }))
      }
    });
    res.code(200);
    return res;
  }

  if (finished === '1') {
    const finishedBooks = books.filter((book) => book.pageCount === book.readPage);

    const res = h.response({
      status: 'success',
      data: {
        books: finishedBooks.map((book) => ({
          id: book.id,
          name: book.name,
          publisher: book.publisher
        }))
      }
    });
    res.code(200);
    return res;
  } else if (finished === '0') {
    const notFinishedBooks = books.filter((book) => book.pageCount !== book.readPage);

    const res = h.response({
      status: 'success',
      data: {
        books: notFinishedBooks.map((book) => ({
          id: book.id,
          name: book.name,
          publisher: book.publisher
        }))
      }
    });
    res.code(200);
    return res;
  }

  if (name) {
    const filteredBooks = books.filter((book) => book.name.toLowerCase().includes(name.toLowerCase()));

    if (filteredBooks.length > 0) {
      const res = h.response({
        status: 'success',
        data: {
          books: filteredBooks.map((book) => ({
            id: book.id,
            name: book.name,
            publisher: book.publisher
          }))
        }
      });
      res.code(200);
      return res;
    }
  }

  const res = h.response({
    status: 'success',
    data: {
      books: books.map((book) => ({
        id: book.id,
        name: book.name,
        publisher: book.publisher
      }))
    }
  });
  res.code(200);
  return res;
};

const getBookByIdHandler = (req, h) => {
  const { id } = req.params;

  const book = books.filter((book) => book.id === id)[0];

  if (book) {
    const res = h.response({
      status: 'success',
      data: {
        book
      }
    });
    res.code(200);
    return res;
  }

  const res = h.response({
    status: 'fail',
    message: 'Buku tidak ditemukan'
  });
  res.code(404);
  return res;
};

const editBookByIdHandler = (req, h) => {
  const { id } = req.params;
  const { name, year, author, summary, publisher, pageCount, readPage, reading } = req.payload;
  const updatedAt = new Date().toISOString();

  if (!name) {
    const res = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Mohon isi nama buku'
    });
    res.code(400);
    return res;
  }

  if (readPage > pageCount) {
    const res = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount'
    });
    res.code(400);
    return res;
  }

  const index = books.findIndex((book) => book.id === id);

  if (index !== -1) {
    books[index] = {
      ...books[index],
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      reading,
      updatedAt
    };

    const res = h.response({
      status: 'success',
      message: 'Buku berhasil diperbarui'
    });
    res.code(200);
    return res;
  }

  const res = h.response({
    status: 'fail',
    message: 'Gagal memperbarui buku. Id tidak ditemukan'
  });
  res.code(404);
  return res;
};

const deleteBookByIdHandler = (req, h) => {
  const { id } = req.params;

  const index = books.findIndex((book) => book.id === id);

  if (index !== -1) {
    books.splice(index, 1);

    const res = h.response({
      status: 'success',
      message: 'Buku berhasil dihapus'
    });
    res.code(200);
    return res;
  }

  const res = h.response({
    status: 'fail',
    message: 'Buku gagal dihapus. Id tidak ditemukan'
  });
  res.code(404);
  return res;
};

module.exports = {
  addNewBookHandler,
  getAllBooksHandler,
  getBookByIdHandler,
  editBookByIdHandler,
  deleteBookByIdHandler
};