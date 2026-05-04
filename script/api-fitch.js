async function get_data() {
    let api_config = {
        baseUrl: 'https://api.themoviedb.org/3',
        token: 'Bearer YOUR_TOKEN_HERE',

    };
    const tmdbConfig = {
        baseUrl: 'https://api.themoviedb.org/3',
        imgBase: 'https://image.tmdb.org/t/p/',
        headers: {
            accept: 'application/json',
            Authorization: 'Bearer YOUR_TOKEN_HERE'
        },
        endpoints: {
            trending: '/trending/movie/day',
            discover: '/discover/movie',
            popular: '/movie/popular',
            topRated: '/movie/top_rated',
            search: '/search/movie',
            genre: '/genre/movie/list',
            movieDetails: (id) => `/movie/${id}`,
            recommendations: (id) => `/movie/${id}/recommendations`
        }
    };
    // url = `https://api.themoviedb.org/3/trending/movie/day?language=arabic`
    // q, discover, trending, genre/ movie/date,popular,toprated, movieid+recommendation?lang=en&page=1



    $.ajax({
        // url: 'https://api.themoviedb.org/3/movie/popular?language=en-US&page=1',
        type: 'GET',
        // headers: {
        //     accept: 'application/json',
        //     Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJlYWQxNzVkYzE5NWEyNDBhMTI4NTUzODlhMTc4YmQyOSIsIm5iZiI6MTc3NzQ4ODcwOC45NTUwMDAyLCJzdWIiOiI2OWYyNTM0NDc2MDc2YzA4MGQ4MjRkNDAiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.LRVlq9a5BITXkDPNWu7TXNSDWLwIEs_yKgT9NqR1h2M'
        // },
        // success: function(data) {
        //     console.log(data);
        // }
    });
}