import axios from 'axios';

export function fetchImag(what, pageGallery, resultsPerPage) {
  const URL = 'https://pixabay.com/api';
  return axios.get(URL, {
    params: {
      key: '31737650-012dbd0b1d73fc9a5bf6ca0f4',
      q: what,
      type: 'photo',
      orientation: 'horizontal',
      safesearch: 'true',
      per_page: resultsPerPage,
      page: pageGallery,
    }
  });
}