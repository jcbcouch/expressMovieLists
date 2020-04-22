

const searchbtn = document.getElementById('searchbtn');
const search = document.getElementById('search');

searchbtn.addEventListener('click', searchmovie);



function searchmovie() {
const http = new HTTP;
const searchvalue = search.value;
http.get(searchvalue)
  .then(data => appendmovie(data))
  .catch(err => console.log(err));
}


function appendmovie (datain) {
  let movieDiv = document.getElementById('movieshere');
  movieDiv.innerHTML = '';
  datain.Search.forEach(movie => {
    let movieTitle = document.createElement('h1');
    let movielink = document.createElement('a');

    movieTitle.innerText = movie.Title;
    movieDiv.appendChild(movieTitle);

    movielink.innerText = 'details';
    movielink.href = `/movie/id/${movie.imdbID}`;
    movieDiv.appendChild(movielink);

    movieDiv.innerHTML += "<br><br>";
    console.log(movie);
    

  });
  

}