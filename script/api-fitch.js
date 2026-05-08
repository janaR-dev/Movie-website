const configs = {
    baseUrl: 'https://api.themoviedb.org/3',
    imgBase: 'https://image.tmdb.org/t/p/',
    accountId: '23070170',
    session_id: "5dfef6bb693651c316dc9d3410d3e10beae6ec20",

    endpoints: {
        trending: '/trending/movie/day',
        discover: '/discover/movie',
        popular: '/movie/popular',
        topRated: '/movie/top_rated',
        search: '/search/movie',
        // genre: '/genre/movie/list',
        movieDetails: (id) => `/movie/${id}`,
        recommendations: (id) => `/movie/${id}/recommendations`,
        watchlist: (accId) => `/account/${accId}/watchlist`,
        accountStates: (id) => `/movie/${id}/account_states`
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
// async function getRequestToken() {
//     try {
//         const response = await $.ajax({
//             url: 'https://api.themoviedb.org/3/authentication/token/new',
//             method: 'GET',
//             headers: {
//                 accept: 'application/json',
//                 Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJlYWQxNzVkYzE5NWEyNDBhMTI4NTUzODlhMTc4YmQyOSIsIm5iZiI6MTc3NzQ4ODcwOC45NTUwMDAyLCJzdWIiOiI2OWYyNTM0NDc2MDc2YzA4MGQ4MjRkNDAiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.LRVlq9a5BITXkDPNWu7TXNSDWLwIEs_yKgT9NqR1h2M'
//             }
//         });

//         console.log(response);
//         return response.request_token;

//     } catch (err) {
//         console.error(err);
//     }
// }


// `https://www.themoviedb.org/authenticate/d1c024d22b478c3f3a4a963472ad2d475d53e5bc`

// async function createSession() {

//     try {
//         const response = await $.ajax({
//             url: 'https://api.themoviedb.org/3/authentication/session/new',
//             method: 'POST',
//             headers: {
//                 accept: 'application/json',
//                 'Content-Type': 'application/json',
//                 Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJlYWQxNzVkYzE5NWEyNDBhMTI4NTUzODlhMTc4YmQyOSIsIm5iZiI6MTc3NzQ4ODcwOC45NTUwMDAyLCJzdWIiOiI2OWYyNTM0NDc2MDc2YzA4MGQ4MjRkNDAiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.LRVlq9a5BITXkDPNWu7TXNSDWLwIEs_yKgT9NqR1h2M'
//             },

//             data: JSON.stringify({
//                 request_token: 'd1c024d22b478c3f3a4a963472ad2d475d53e5bc'
//             })
//         });

//         console.log(response);

//         return response.session_id;

//     } catch (err) {
//         console.error(err);
//     }
// }
// const sessionId = createSession();

// console.log(sessionId);

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


async function Watchlist(movie_id, addToWatchlist) {

    const endpoint = configs.endpoints.watchlist(configs.accountId);
    const final_url = build_url(endpoint, { session_id: configs.session_id });

    const ajaxConfig = {
        url: final_url,
        method: 'POST',
        headers: configs.headers,
        contentType: 'application/json',
        data: JSON.stringify({
            media_type: "movie",
            media_id: movie_id,
            watchlist: addToWatchlist
        })
    };

    try {
        const response = await $.ajax(ajaxConfig);
        console.log(`Movie ${addToWatchlist ? 'added to' : 'removed from'} watchlist:`, response);
        return response.success;
    } catch (err) {
        console.error("Error watchlist:", err);
        return false;
    }
}

async function getWatchlist() {

    const endpoint = configs.endpoints.watchlist(configs.accountId);
    const params = {
        session_id: configs.session_id,
        language: 'en-US',
        page: 1,
        sort_by: 'created_at.asc'
    };

    const final_url = build_url(endpoint, params);

    try {
        const response = await $.ajax({
            url: final_url,
            method: 'GET',
            headers: configs.headers
        });

        return response.results || [];
    } catch (err) {
        console.error("Error fetching watchlist:", err);
        return [];
    }
}

async function isInWatchlist(movie_id) {
    const endpoint = configs.endpoints.accountStates(movie_id);
    const final_url = build_url(endpoint, {});

    try {
        const response = await $.ajax({
            url: final_url,
            method: 'GET',
            headers: configs.headers
        });

        return response.watchlist;
    } catch (err) {
        console.error("Error checking watchlist status:", err);
        return false;
    }
}

async function display_watchlist() {
    let $container = $('.watchlist .movies');

    $container.html('<div class="loading">Loading watchlist...</div>');
    let watchlist = await getWatchlist();

    if (watchlist.length === 0) {
        $container.append('<div class="empty-watchlist">Your watchlist is empty</div>');
        return;
    }

    $container.empty();
    $.each(watchlist, function(key, movie) {
        let posterPath = movie.poster_path ?
            configs.imgBase + 'w500' + movie.poster_path :
            configs.imgBase + 'w1280' + movie.backdrop_path;


        let card = `
                    <div class="col-lg-3 col-md-6 col-sm-12 mb-4">
                        <div class="card h-100">
                            <img src="${posterPath}" class="card-img-top" alt="${movie.title}">
                            <div class="card-body">
                                <h5 class="card-title">${movie.title.length > 20 ? movie.title.slice(0, 18) + '...' : movie.title}</h5>
                            <h6 class="movie-rate">${movie.vote_average.toFixed(1)}/10</h6>
                        </div>
                        <a href="#" class="view" data-id="${movie.id}">View</a>
                        <a href="#" class="watchlist active" data-id="${movie.id}" title="Remove from Watchlist">
                    <i class="fa-regular fa-clock"></i>
                        </a>
                    </div>
                </div>`;
        $container.append(card);
    });
}