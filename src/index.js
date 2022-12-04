import './css/styles.css';

import { Notify } from 'notiflix/build/notiflix-notify-aio';
import {fetchImag} from './js/fetchSearch'

const searchEl = document.querySelector('#search-form');
const galleryEl = document.querySelector('.gallery');
const guardEl = document.querySelector('.guard');

const optionScroll = {
  root: null,
  rootMargin: '200px',
  threshold: 1.0,
}

const observer = new IntersectionObserver(loadMore, optionScroll);

searchEl.addEventListener('submit', searchImg);

let page = 1;
let what = '';
const  resultsPerPage = 16;

function searchImg(event) {
  event.preventDefault();
  what = event.target.searchQuery.value;
  galleryEl.innerHTML = '';
  page = 1;
  fetchImag(what, page ,resultsPerPage).then(r => addMarkup(r));
}

function loadMore(entries, observer) {
  entries.forEach(entry => {
    console.log(entry.isIntersecting)
    if (entry.isIntersecting) {
      page +=1;
      fetchImag(what, page, resultsPerPage).then(r => addMarkup(r));
    }
  });
}

// function fetchImag(what, pageGallery) {
//   const URL = 'https://pixabay.com/api';
//   return axios.get(URL, {
//     params: {
//       q: what,
//       key: '31737650-012dbd0b1d73fc9a5bf6ca0f4',
//       type: 'photo',
//       orientation: 'horizontal',
//       safesearch: 'true',
//       per_page: resultsPerPage,
//       page: pageGallery,
//     }
//   }).then(r => addMarkup(r));
// }

function addMarkup(data) {
  console.log(data)
  if (!data.data.hits.length) {
    return Notify.info('Sorry, there are no images matching your search query. Please try again.')
  } else if (Math.ceil(data.data.totalHits/resultsPerPage)===page) {
    galleryEl.insertAdjacentHTML('beforeend', createGalleryMarkup(data));
    observer.unobserve(guardEl);
    return Notify.info("We're sorry, but you've reached the end of search results.");
  }
    galleryEl.insertAdjacentHTML('beforeend', createGalleryMarkup(data));
  observer.observe(guardEl);
}

function createGalleryMarkup(data) {
  console.dir(data.data.hits)
  return data.data.hits.map( card => 
    `<div class="photo-card">
    <img src="${card.largeImageURL}" alt="${card.tags}" loading="lazy" width="260" height="195"/>
      <div class="info">
        <p class="info-item">
          <b>Likes:</b>${card.likes}
        </p>
        <p class="info-item">
          <b>Views:</b>${card.views}
        </p>
        <p class="info-item">
          <b>Comments:</b>${card.comments}
        </p>
        <p class="info-item">
          <b>Downloads:</b>${card.downloads}
        </p>
      </div>
    </div>`
  ).join('');
}