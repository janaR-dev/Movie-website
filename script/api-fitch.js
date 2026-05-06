const configs = {
    baseUrl: 'https://api.themoviedb.org/3',
    imgBase: 'https://image.tmdb.org/t/p/',

    endpoints: {
        trending: '/trending/movie/day',
        discover: '/discover/movie',
        popular: '/movie/popular',
        topRated: '/movie/top_rated',
        search: '/search/movie',
        // genre: '/genre/movie/list',
        movieDetails: (id) => `/movie/${id}`,
        recommendations: (id) => `/movie/${id}/recommendations`
    },
    defaults: {
        language: 'en-US',
        page: 1,
        include_adult: false,
        certification_country: "US",
        "certification.lte": `G`,
        region: 'US'
    },
    headers: {
        accept: 'application/json',
        Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJlYWQxNzVkYzE5NWEyNDBhMTI4NTUzODlhMTc4YmQyOSIsIm5iZiI6MTc3NzQ4ODcwOC45NTUwMDAyLCJzdWIiOiI2OWYyNTM0NDc2MDc2YzA4MGQ4MjRkNDAiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.LRVlq9a5BITXkDPNWu7TXNSDWLwIEs_yKgT9NqR1h2M'
    }
};

function build_url(endpoint, new_params = {}) {
    let url = new URL(configs.baseUrl + endpoint),
        final_params = Object.assign({}, configs.defaults, new_params);
    Object.keys(final_params).forEach(key => {
        url.searchParams.append(key, final_params[key]);
    });

    return url.toString();
}

async function get_lists(endpoint, params, method) {

    // url = `https://api.themoviedb.org/3/trending/movie/day?language=arabic`
    // q, discover, trending, genre/ movie/date,popular,toprated, movieid+recommendation?lang=en&page=1
    let final_url = build_url(endpoint, params);

    try {
        let response = await $.ajax({
            url: final_url,
            method,
            headers: configs.headers
        });

        return response.results;

    } catch (err) {
        console.error("Fetch error:", err);

    }




}