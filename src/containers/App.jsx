import React, { useEffect, useState } from 'react';

import useInitialState from '../hooks/useInitialState';
import Header from '../components/Header';
import Search from '../components/Search';
import Categories from '../components/Categories';
import Carousel from '../components/Carousel';
import CarouselItem from '../components/CarouselItem';
import Footer from '../components/Footer';
import '../assets/styles/App.scss';

function App() {
  const API = 'http://localhost:3000/initialState';
  const videos = useInitialState(API);

  return (
    <div className="app">
      <Header />
      <Search />

      {
        videos.mylist.length > 0 && (
        <Categories title="Mi lista">
          <Carousel>
            <CarouselItem />
            <CarouselItem />
          </Carousel>
        </Categories>
        )
      }

      <Categories title="Tendencias">
        <Carousel>
          {
            videos.trends.map((item) => <CarouselItem key={item.id} {...item} />)
          }
        </Carousel>
      </Categories>

      <Categories title="Originales">
        <Carousel>
          {
            videos.originals.map((item) => <CarouselItem key={item.id} {...item} />)
          }
        </Carousel>
      </Categories>

      <Footer />
    </div>
  );
}

export default App;
