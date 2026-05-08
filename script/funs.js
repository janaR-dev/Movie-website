async function popular_show() {
    let genresToShow = ['Action', 'Family', 'Comdey', 'Animation'];

    for (let name of genresToShow) {
        let $container = $(`.genre.${name} .items`);

        let movie_list = await get_lists(
            configs.endpoints.discover, { sort_by: `popularity.desc`, with_genres: `${genres[name].id}` },
            'GET'
        );

        $container.empty();

        $.each(movie_list.slice(0, 20), function(key, movie) {
            let posterPath = movie.poster_path ?
                configs.imgBase + 'w500' + movie.poster_path :
                configs.imgBase + 'w500' + movie.backdrop_path;

            let card = `
                <div class="col-lg-3 col-md-6 col-sm-12 mb-4">
                    <div class="card h-100">
                        <img src="${posterPath}" class="card-img-top" alt="${movie.title}">
                        <div class="card-body">
                            <h5 class="card-title">${movie.title.length > 20 ? movie.title.slice(0, 18) + '...' : movie.title}</h5>
                            <h6 class="movie-rate">${movie.vote_average.toFixed(1)}/10</h6>
                        </div>
                        <a href="#" class="view" data-id="${movie.id}">View</a>
                        <a href="#" class="toggle_watchlist " data-id="${movie.id}"><i class="fa-regular fa-clock"></i></a>

                    </div>
                </div>`;

            $container.append(card);
        });
    }
}

async function trending_show() {


    let $container = $(`.mySwiper .swiper-wrapper`);

    let movie_list = await get_lists(
        configs.endpoints.trending,
        'GET'
    );
    $container.empty();

    $.each(movie_list.slice(0, 10), function(key, movie) {
        let posterPath = movie.backdrop_path ?
            configs.imgBase + 'w1280' + movie.backdrop_path :
            configs.imgBase + 'w500' + movie.poster_path;

        let swip = `
                <div class="swiper-slide">
                        <img src="${posterPath}" />
                        <div class="swipe-body">
                            <h4 class="swip-title">${movie.title}</h4>
                            <a href="#" class="view" data-id="${movie.id}">View</a>
                        </div>


                </div>`;

        $container.append(swip);
    });
    var swiper = new Swiper(".mySwiper", {
        effect: "coverflow",
        grabCursor: true,
        centeredSlides: true,
        slidesPerView: "auto",
        autoplay: {
            delay: 2500,
            disableOnInteraction: false,
        },
        loop: true,
        coverflowEffect: {
            rotate: 50,
            stretch: 0,
            depth: 100,
            modifier: 1,
            slideShadows: false,
        },
        pagination: {
            el: ".swiper-pagination",
            clickable: true,

        },
    });
}

async function top_rated_show() {


    let $container = $(`.mySwiper2 .swiper-wrapper`);

    let movie_list = await get_lists(
        configs.endpoints.topRated,
        'GET'
    );
    $container.empty();

    $.each(movie_list.slice(0, 10), function(key, movie) {
        let posterPath = movie.backdrop_path ?
            configs.imgBase + 'w1280' + movie.backdrop_path :
            configs.imgBase + 'w500' + movie.poster_path;

        let swip = `
                    <div class="swiper-slide">
                        <img src="${posterPath}" alt="">
                        <div class="swip-body">
                            <h3 class="title">${movie.title}</h3>
                        </div>                           
                         <h4 class="ratee">${movie.vote_average.toFixed(1)}/10</h4>
                        <a href="#" class="view" data-id="${movie.id}">View</a>

                    </div>`;

        $container.append(swip);
    });
    var swiper = new Swiper(".mySwiper2", {
        direction: "vertical",
        autoplay: {
            delay: 3000,
            disableOnInteraction: false,
        },
        loop: true,
        pagination: {
            el: ".swiper-pagination",
            clickable: true,
        },
    });
}
async function filter() {
    let $container = $('.filter-results'),
        $genre_checked = $('#nav-genre input:checked'),
        $language_checked = $('#nav-Language input:checked'),
        $age_certifi = $('#nav-age input:checked');
    if ($genre_checked.length === 0 && $language_checked.length === 0 && $age_certifi.length === 0) {
        $container.addClass('d-none').empty();
        $('.main-pop').removeClass('d-none');
        return;
    }
    $('.main-pop').addClass('d-none');
    $container.removeClass('d-none').empty();
    let selected_genres = [],
        selected_lang = [],
        selected_age = "";
    $genre_checked.each(function() {
        let id = $(this).attr('id');
        if (genres[id]) selected_genres.push(genres[id].id);
    });

    $language_checked.each(function() {
        selected_lang.push($(this).attr('id'));
    });

    $age_certifi.each(function() {
        selected_age = $(this).val();
    });
    if (selected_age.length == '') {
        selected_age = 'G'
    }
    let filter_params = {
        with_genres: selected_genres.join(','),
        with_original_language: selected_lang.join(','),
        "certification.lte": selected_age,
        include_adult: false
    };

    let movie_list = await get_lists(configs.endpoints.discover, filter_params, 'GET');
    $.each(movie_list.slice(0, 24), function(key, movie) {

        $('.main-pop').addClass('d-none');
        $container.removeClass('d-none');
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
                        <a href="#" class="watch-later" data-id="${movie.id}"><i class="fa-regular fa-clock"></i></a>

                    </div>
                </div>`;

        $container.append(card);
    });


}

async function searchin() {
    let search = $search_in.val().trim(),
        $container = $('.search-result');

    if (search !== "") {
        let movie_list = await get_lists(configs.endpoints.search, {
            query: search,
            include_adult: false,
            certification_country: "US",
            "certification.lte": `G`
        }, 'GET');

        $('section').addClass('d-none');
        $('.intro').addClass('d-none');
        $container.removeClass('d-none');

        $home_btn.removeClass('active');

        $.each(movie_list.slice(0, 48), function(key, movie) {
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
                        <a href="#" class="watchlist" data-id="${movie.id}"><i class="fa-regular fa-clock"></i></a>

                    </div>
                </div>`;
            $container.append(card);
        });
    } else {
        back_home();
    }
}

function back_home() {
    let $container = $('.search-result');
    $search_in.val('');
    $container.addClass('d-none').empty();
    $('section').removeClass('d-none');
    $('#Recomendations').addClass('d-none');
    $('.intro').removeClass('d-none');
    $home_btn.addClass('active');
}