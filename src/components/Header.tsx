import React from "react";
import "./css/Header.css";
import SearchBar from "./SerachBar";

const Header: React.FC = () => {
  const handleSearch = (value: string) => {
    console.log("Search value:", value);
  };

  return (
    <header className="header">
      {/* לוגו בצד שמאל */}
      <div className="header-logo">CommUnity</div>

      {/* שורת חיפוש במרכז */}
      <div className="header-search">
        <SearchBar
          placeholder="Search for communities..."
          onSearch={handleSearch}
        />
      </div>

      {/* כפתורים בצד ימין */}
      <div className="header-buttons">
        <button className="header-button login-button">Login</button>
        <button className="header-button signin-button">Sign In</button>
      </div>
    </header>
  );
};

export default Header;
