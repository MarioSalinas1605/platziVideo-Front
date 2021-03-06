/* eslint-disable no-underscore-dangle */
/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { useSelector } from 'react-redux';

import Search from '../components/Search';
import Categories from '../components/Categories';
import Carousel from '../components/Carousel';
import CarouselItem from '../components/CarouselItem';
import Header from '../components/Header';
import '../assets/styles/App.scss';

function Home() {
  const { myList, trends, originals } = useSelector((state) => state);

  return (
    <>
      <Header />
      <Search />

      {
        myList.length > 0 && (
        <Categories title="Mi lista">
          <Carousel>
            {
              myList.map((item) => <CarouselItem key={item._id} {...item} isList />)
            }
          </Carousel>
        </Categories>
        )
      }

      <Categories title="Tendencias">
        <Carousel>
          {
            trends.map((item) => <CarouselItem key={item._id} {...item} />)
          }
        </Carousel>
      </Categories>

      <Categories title="Originales">
        <Carousel>
          {
            originals.map((item) => <CarouselItem key={item._id} {...item} />)
          }
        </Carousel>
      </Categories>
    </>
  );
}

export default Home;
