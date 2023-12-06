// Inside NewsDetail.js

import React from 'react';
import './NewsDetail.css'; // Import the NewsDetail CSS file

const NewsDetail = ({ article, onClose }) => {
  return (
    <div className="news-detail-popup">
      <div className="news-detail-content">
        <button className="close-button" onClick={onClose}>
          &times;
        </button>
        <h2>{article.title}</h2>
        <img src={article.urlToImage} alt={article.title} className="news-image" />
        <p>{article.description}</p>
        <a href={article.url} target="_blank" rel="noopener noreferrer">
          Read Full Article
        </a>
      </div>
    </div>
  );
};

export default NewsDetail;
