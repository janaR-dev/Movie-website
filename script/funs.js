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