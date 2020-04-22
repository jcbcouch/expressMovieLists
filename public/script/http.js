class HTTP {

    async get(search) {
        let url = `http://www.omdbapi.com/?&apikey=16c8b15a&s=${search}`;
        const response = await fetch(url);
        const resData = await response.json();
        return resData;
      }
}