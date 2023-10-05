import React, { useEffect, useState } from "react";
import SpinnerLoading from "../Utils/SpinnerLoading";
import BookModel from "../../models/BookModel";
import SearchBook from "./SearchBook";
import Pagination from "../Utils/Pagination";

export const SearchBooksPage = () => {
  const [books, setBooks] = useState<BookModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [httpError, setHttpError] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [booksPerPage, setBooksPerPage] = useState(5);
  const [totalAmountOfBooks, setTotalAmountOfBooks] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const [search, setSearch] = useState("");
  const [searchUrl, setSearchUrl] = useState("");

  const [category, setCategory] = useState("Book category");
  const [categoryUrl, setCategoryUrl] = useState("");

  const searchHandleChange = () => {
    if (search === "") {
      setSearchUrl("");
    } else {
      setSearchUrl(
        `/search/findByTitleContaining?title=${search}&page=0&size=${booksPerPage}`
      );
    }
  };

  const categoryHandleChange = (value: string) => {
    if (
      value.toLowerCase() === "fe" ||
      value.toLowerCase() === "be" ||
      value.toLowerCase() === "data" ||
      value.toLowerCase() === "devops"
    ) {
      setCategory(value);
      setSearchUrl(
        `/search/findByCategory?category=${value}&page=0&size=${booksPerPage}`
      );
    } else {
      setCategory("All");
      setSearchUrl(`?page=0&size=${booksPerPage}`);
    }
  };

  useEffect(() => {
    const fetchBooks = async () => {
      const baseUrl: string = "http://localhost:8080/api/books";

      let url: string = "";

      if (searchUrl === "") {
        url = `${baseUrl}?page=${currentPage - 1}&size=${booksPerPage}`;
      } else {
        url = baseUrl + searchUrl;
      }

      const response = await fetch(url);
      const responseJson = await response.json();
      const responseData: BookModel[] = await responseJson._embedded.books;

      if (!response.ok) {
        throw new Error("Something went wrong");
      }

      const loadedBooks: BookModel[] = [];

      for (const key in responseData) {
        loadedBooks.push({
          id: responseData[key].id,
          title: responseData[key].title,
          description: responseData[key].description,
          author: responseData[key].author,
          copies: responseData[key].copies,
          copiesAvailable: responseData[key].copiesAvailable,
          category: responseData[key].category,
          img: responseData[key].img,
        });
      }

      setBooks(loadedBooks);
      setLoading(false);

      setTotalAmountOfBooks(responseJson.page.totalElements);
      setTotalPages(responseJson.page.totalPages);
    };

    fetchBooks().catch((err: any) => {
      setHttpError(err.message);
      setLoading(false);
    });
    window.scrollTo(0, 0);
  }, [currentPage, searchUrl]);

  if (loading) {
    return (
      <div className="container m-5">
        <SpinnerLoading />
      </div>
    );
  }
  if (httpError) {
    <div className="container m-5">
      <p>{httpError}</p>
    </div>;
  }

  //this is good but there's a problem
  const indexOfLastBook: number = currentPage * booksPerPage;
  //solution
  let lastItem =
    booksPerPage * currentPage <= totalAmountOfBooks
      ? booksPerPage * currentPage
      : totalAmountOfBooks;
  const indexOfFirstBook: number = indexOfLastBook - booksPerPage;

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);
  return (
    <div>
      <div className="container">
        <div>
          <div className="row mt-5">
            <div className="col-6">
              <div className="d-flex">
                <input
                  className="form-control me-2"
                  type="search"
                  placeholder="Search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  aria-labelledby="Search"
                />
                <button
                  className="btn btn-outline-success"
                  onClick={searchHandleChange}
                >
                  Search
                </button>
              </div>
            </div>
            <div className="col-4">
              <div className="dropdown">
                <button
                  className="btn btn-secondary dropdown-toggle"
                  type="button"
                  id="dropdownMenuButton1"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  {category}
                </button>
                <ul
                  className="dropdown-menu"
                  aria-labelledby="dropdownMenuButton1"
                >
                  <li onClick={() => categoryHandleChange("All")}>
                    <a className="dropdown-item" href="#">
                      All
                    </a>
                  </li>
                  <li onClick={() => categoryHandleChange("FE")}>
                    <a className="dropdown-item" href="#">
                      Front End
                    </a>
                  </li>
                  <li onClick={() => categoryHandleChange("BE")}>
                    <a className="dropdown-item" href="#">
                      Back End
                    </a>
                  </li>
                  <li onClick={() => categoryHandleChange("Data")}>
                    <a className="dropdown-item" href="#">
                      Data
                    </a>
                  </li>
                  <li onClick={() => categoryHandleChange("DevOps")}>
                    <a className="dropdown-item" href="#">
                      DevOps
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          {totalAmountOfBooks > 0 ? (
            <>
              <div className="mt-3">
                <h5>Number of results: ({totalAmountOfBooks})</h5>
              </div>
              <p>
                {indexOfFirstBook + 1} to {lastItem} of {totalAmountOfBooks}{" "}
                items:
              </p>
              {books.map((book) => (
                <SearchBook book={book} key={book.id} />
              ))}
              {totalPages > 1 && (
                <Pagination
                  currentPage={currentPage}
                  paginate={paginate}
                  totalPages={totalPages}
                />
              )}
            </>
          ) : (
            <div className="m-5">
              <h3>Can't find what you are looking for ?</h3>
              <a
                href="button"
                className="btn main-color btm-md px-4 me-md-2 fw-bold text-white"
              >
                Library Services
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
