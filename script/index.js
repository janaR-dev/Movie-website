//  let populer_genre = $('#populae .');
let $filter_inputs = $('#nav-genre input, #nav-Language input, #nav-age input'),
    $search_in = $('.search-in'),
    $home_btn = $('.nav-link[href="#"]:contains("Home")');;

trending_show();
top_rated_show();
popular_show();

$filter_inputs.on('change', function() {

    filter();
})

// $search_in.on("keyup", async function() {
//     let search = $search_in.val(),
//         $container = $('.search-result');
//     if (search.trim() !== "") {
//         let movie_list = await get_lists(configs.endpoints.search, {
//             query: `${search}`,
//             include_adult: false,
//         }, 'GET');
//         $.each(movie_list.slice(0, 48), function(key, movie) {
//             $('section').addClass('d-none');
//             $('.intro').addClass('d-none');
//             $container.removeClass('d-none');
//             let posterPath = movie.poster_path ?
//                 configs.imgBase + 'w500' + movie.poster_path :
//                 configs.imgBase + 'w1280' + movie.backdrop_path;

//             let card = `
//                     <div class="col-lg-3 col-md-6 col-sm-12 mb-4">
//                         <div class="card h-100">
//                             <img src="${posterPath}" class="card-img-top" alt="${movie.title}">
//                             <div class="card-body">
//                                 <h5 class="card-title">${movie.title.length > 20 ? movie.title.slice(0, 18) + '...' : movie.title}</h5>
//                             <h6 class="movie-rate">${movie.vote_average.toFixed(1)}/10</h6>
//                         </div>
//                         <a href="#" class="view" data-id="${movie.id}">View</a>
//                         <a href="#" class="watch-later" data-id="${movie.id}"><i class="fa-regular fa-clock"></i></a>

//                     </div>
//                 </div>`;

//             $container.append(card);
//         })
//     } else {
//         $('section').removeClass('d-none');
//         $('.intro').removeClass('d-none');
//         $container.addClass('d-none');
//     }


// })



$search_in.on("keyup", function() {
    searchin();
});

$('form[role="search"]').on('submit', function(e) {
    e.preventDefault();
    searchin();
});

$home_btn.on('click', function(e) {
    e.preventDefault();
    back_home();
});