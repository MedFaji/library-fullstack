import React from "react";
import "./App.css";
import Navbar from "./layouts/NavbarAndFooter/Navbar";
import Footer from "./layouts/NavbarAndFooter/Footer";
import HomePage from "./layouts/HomePage/HomePage";
import SearchBook from "./layouts/SearchBooksPage/SearchBook";
import { SearchBooksPage } from "./layouts/SearchBooksPage/SearchBooksPage";

function App() {
  return (
    <>
      <Navbar />
      <SearchBooksPage />
      {/* <HomePage /> */}
      <Footer />
    </>
  );
}

export default App;
