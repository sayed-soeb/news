import React, { useEffect, useState } from 'react';
import { collection, getDocs, deleteDoc } from 'firebase/firestore';
import { firestore, auth } from './firebase';
import './FavouriteList.css';

const FavouriteList = () => {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        if (auth.currentUser) {
          const favoritesCollection = collection(firestore, `users/${auth.currentUser.uid}/favorites`);
          const querySnapshot = await getDocs(favoritesCollection);
          const favoritesData = querySnapshot.docs.map((doc) => doc.data());
          setFavorites(favoritesData);
        }
      } catch (error) {
        console.error('Error fetching favorites:', error);
      }
    };

    fetchFavorites();
  }, []);

  const removeFromFavorites = async (article) => {
    try {
      if (auth.currentUser) {
        const favoritesCollection = collection(firestore, `users/${auth.currentUser.uid}/favorites`);
        const querySnapshot = await getDocs(favoritesCollection);

        querySnapshot.docs.forEach(async (doc) => {
          if (doc.data().title === article.title) {
            await deleteDoc(doc.ref);
          }
        });

        // Update favorites state to trigger re-render
        const updatedFavorites = favorites.filter((fav) => fav.title !== article.title);
        setFavorites(updatedFavorites);
      }
    } catch (error) {
      console.error('Error removing from favorites:', error);
    }
  };

  return (
    <div>
      <h2>Favourite News</h2>
      <ul className="favourite-list">
        {favorites.map((article) => (
          <li key={article.title} className="favourite-item">
            <img src={article.urlToImage || 'https://s.france24.com/media/display/d1676b6c-0770-11e9-8595-005056a964fe/w:1024/p:16x9/news_1920x1080.png'} alt={article.title} className="favourite-image" />
            <div className="favourite-details">
              <h3 className="favourite-title">{article.title}</h3>
              <p>{article.description}</p>
              <button className="remove-button" onClick={() => removeFromFavorites(article)}>
                Remove from Favorites
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FavouriteList;
