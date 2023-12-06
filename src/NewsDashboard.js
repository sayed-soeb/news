import React, { useEffect, useState } from 'react';
import { addDoc, collection, getDocs, deleteDoc } from 'firebase/firestore';
import { app, auth, firestore } from "./firebase";
import NewsDetail from './NewsDetail';
import { Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './NewsDashboard.css';

const LOCAL_STORAGE_KEY = 'newsData';

const NewsDashboard = () => {
  const [newsData, setNewsData] = useState([]);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [isGridView, setIsGridView] = useState(false);
  const [user, setUser] = useState(null);
  const [isArticleInFavorites, setIsArticleInFavorites] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Check if data exists in local storage
        const localData = localStorage.getItem(LOCAL_STORAGE_KEY);
  
        if (localData && localData !== 'undefined') {
          // If data exists in local storage and is not 'undefined', use it
          setNewsData(JSON.parse(localData));
        } else {
          // If no data in local storage or it's 'undefined', fetch from the API
          const response = await fetch('https://newsdata.io/api/1/news?apikey=pub_34212cef8937c9af0b74fc93c25056ecc888c&q=cryptocurrency');
          const data = await response.json();
  
          if (data.status === 'success' && Array.isArray(data.results)) {
            // Set fetched data to state
            setNewsData(data.results);
  
            // Save the fetched data to local storage
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data.results));
          } else {
            console.error('Invalid API response:', data);
          }
        }
      } catch (error) {
        console.error('Error fetching news data:', error);
      }
    };
  
    // Call the fetchData function when the component mounts
    fetchData();
  }, []);
  

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
    });

    return () => unsubscribe();
  }, []);

  const handleToggleView = () => {
    setIsGridView(!isGridView);
  };

  const handleFavoriteClick = async (article) => {
    try {
      if (auth.currentUser) {
        const favoritesCollection = collection(firestore, `users/${auth.currentUser.uid}/favorites`);
        const querySnapshot = await getDocs(favoritesCollection);

        const isArticleInFavorites = querySnapshot.docs.some((doc) => doc.data().title === article.title);

        if (isArticleInFavorites) {
          querySnapshot.docs.forEach(async (doc) => {
            if (doc.data().title === article.title) {
              await deleteDoc(doc.ref);
              toast.error('Removed from Favorites');
            }
          });
        } else {
          await addDoc(favoritesCollection, article);
          toast.success('Added to Favorites');
        }
      } else {
        console.log('User not authenticated. Unable to add/remove from favorites.');
      }
    } catch (error) {
      console.error('Error handling favorites:', error);
      toast.error('Error handling Favorites');
    }
  };

  const handleLogout = async () => {
    try {
      await auth.signOut();
      console.log('User logged out successfully.');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const openArticleDetail = (article) => {
    setSelectedArticle(article);
  };

  const closeArticleDetail = () => {
    setSelectedArticle(null);
  };

  return (
    <div>
      <div className="dashboard-navbar">
        <div className="navbar-left">
          <h1>News App</h1>
        </div>
        <div className="navbar-right">
          {user ? (
            <>
              <span>{user.email}</span>
              <button className="nav-button" onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to='/login'>
                <button className="nav-button">Login/Signup</button>
              </Link>
            </>
          )}
        </div>
      </div>
      <div>
      <button className="nav-button" onClick={handleToggleView}>
            Toggle View
          </button>
          <Link to="/fav">
            <button className="nav-button">View Favorites</button>
          </Link>
      </div>
      <div className={`news-dashboard ${isGridView ? 'grid-view' : ''}`}>
        <div className={`column ${isGridView ? 'grid' : ''}`}>
          {newsData.map((article) => (
            <div key={article.article_id} className="news-card">
              <img src={article.image_url || 'https://newsinterpretation.com/wp-content/uploads/2020/03/news33.jpg'} alt={article.title} className="news-image" />
              <div className="news-info">
                <h3 onClick={() => openArticleDetail(article)}>{article.title}</h3>
                <p>{article.description}</p>
                <button
                  className={`favorite-button ${isArticleInFavorites ? 'added' : ''}`}
                  onClick={() => handleFavoriteClick(article)}
                >
                  ❤️ Add to Favorites
                </button>
                <a href={article.link} target="_blank" rel="noopener noreferrer">
                  Read more
                </a>
              </div>
            </div>
          ))}
        </div>
        {selectedArticle && (
          <div className="news-detail-overlay">
            <NewsDetail article={selectedArticle} onClose={closeArticleDetail} />
          </div>
        )}
      </div>
      <ToastContainer />
    </div>
  );
};

export default NewsDashboard;
