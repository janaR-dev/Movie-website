//  let populer_genre = $('#populae .');

let $filter_inputs = $('#nav-genre input, #nav-Language input, #nav-age input'),
    $search_in = $('.search-in'),
    $home_btn = $('.nav-link[href="#"]:contains("Home")'),
    $list = $(`.movie_list`),
    $loadingModal_ele = $('#loadingModal'),
    $loadingModal = new bootstrap.Modal($loadingModal_ele),
    $activeRequests = 0,
    $tooltipTriggerList =
        [].slice.call(
            $('[title]')
        );

$tooltipTriggerList.map(el =>
    new bootstrap.Tooltip(el)
);


update_theme()
init_user();
trending_show();
top_rated_show();
popular_show();
checkFavoritesEmpty();
checkWatchlistEmpty();
update_watchlist();
update_fav();

$filter_inputs.on('change', function () {

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



$search_in.on("keyup", function () {
    searchin();
});

$('form[role="search"]').on('submit', function (e) {
    e.preventDefault();
    searchin();
});

$home_btn.on('click', function (e) {
    e.preventDefault();
    back_home();
});
$('i.close_popup').on('click', function () {

    $(this).parent().parent().toggleClass('active');



});
$('.nav-link.popup').on('click', function (e) {
    e.preventDefault();

    let popup = $(this).attr('href');

    $(`${popup}`).toggleClass('active');


});

$(document).on('click', '.toggle_watchlist', async function (e) {
    e.preventDefault();
    let id = $(this).data('id');
    toggle_LS(id, 'watchlist');
    await update_watchlist();
    checkFavoritesEmpty();
    checkWatchlistEmpty();
    update_fav()
    check_icon(id)

});

$(document).on('click', '.toggle_fav', async function (e) {
    e.preventDefault();
    let id = $(this).data('id');
    toggle_LS(id, 'fav');
    await update_fav();
    checkFavoritesEmpty();
    checkWatchlistEmpty();
    update_watchlist()
    check_icon(id)

});

$(document).on('click', '.view', async function (e) {

    e.preventDefault();

    let movieId = $(this).data('id');

    $('.view_movie').css('left', '0%');

    await movie_details(movieId);
});

$(document).on('click', '.view_movie nav .fa-angle-left', function () {
    $('.view_movie').css('left', '100%');
});
$("input", ".login-popup").on("blur change", function () {
    validateInput($(this));
});

$(document).on("click", "#logoutBtn", logoutUser);
$(document).on('click', '.teaser', function () {
    let currentTheme = localStorage.getItem('theme') || 'light';


    let key = $(this).attr('data-key');

    if (!key) {

         Swal.mixin({
            toast: true,
            position: "center",
            showConfirmButton: false,
            timer: 2000,
            theme: `${currentTheme}`,
            timerProgressBar: true,
            didOpen: (toast) => {
                toast.onmouseenter = Swal.stopTimer;
                toast.onmouseleave = Swal.resumeTimer;
            }
        }).fire({
            icon: "error",
            title: "Trailer is not avilable",
            theme: `${currentTheme}`

        });
        return;
    }

    $('#movieTrailer').attr(
        'src',
        `https://www.youtube.com/embed/${key}?autoplay=1`
    );

    $('.video-popup').fadeIn();
});

$(document).on('click', '.close-video', function () {

    $('.video-popup').fadeOut();

    $('#movieTrailer').attr('src', '');

});

$(document).on(
    'click',
    '.add-review-btn',
    write_review
);

$(document).on(
    'click',
    '.delete-review',
    function () {

        let movieId =
            $(this).data('movie-id');

        let reviewId =
            $(this).data('review-id');

        delete_review(movieId, reviewId);

        load_Reviews(movieId);
    }
);

$('#mode').on('change', function () {

    if ($(this).is(':checked')) {

        $('body').addClass('dark');

        localStorage.setItem(
            'theme',
            'dark'
        );

    } else {

        $('body').removeClass('dark');

        localStorage.setItem(
            'theme',
            'light'
        );
    }
});

