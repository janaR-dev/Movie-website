async function popular_show() {
    let genresToShow = ['Action', 'Family', 'Comdey', 'Animation'];

    for (let name of genresToShow) {
        let $container = $(`.genre.${name} .items`);

        let movie_list = await get_lists(
            configs.endpoints.discover, { sort_by: `popularity.desc`, with_genres: `${genres[name].id}` },
            'GET'
        );

        $container.empty();

        $.each(movie_list.slice(0, 20), function (key, movie) {
            let posterPath = movie.poster_path ?
                configs.imgBase + 'w500' + movie.poster_path :
                configs.imgBase + 'w500' + movie.backdrop_path;

            let card = `
                <div class="col-lg-3 col-md-6 col-sm-6 mb-4">
                    <div class="card h-100" title="${movie.title}">
                        <img src="${posterPath}" class="card-img-top" alt="${movie.title}">
                        <div class="card-body">
                            <h5 class="card-title">${movie.title.length > 20 ? movie.title.slice(0, 18) + '...' : movie.title}</h5>
                            <h6 class="movie-rate">${movie.vote_average.toFixed(1)}/10</h6>
                        </div>
                        <a href="#" class="view" data-id="${movie.id}">View</a>
                        <a href="#" class="toggle_watchlist" data-id="${movie.id}"><i class="fa-regular fa-clock"></i></a>
                        <a href="#" class="toggle_fav" data-id="${movie.id}"><i class="fa-regular fa-heart"></i></a>
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

    $.each(movie_list.slice(0, 10), function (key, movie) {
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

    $.each(movie_list.slice(0, 10), function (key, movie) {
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
    $genre_checked.each(function () {
        let id = $(this).attr('id');
        if (genres[id]) selected_genres.push(genres[id].id);
    });

    $language_checked.each(function () {
        selected_lang.push($(this).attr('id'));
    });

    $age_certifi.each(function () {
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
    $.each(movie_list.slice(0, 24), function (key, movie) {

        $('.main-pop').addClass('d-none');
        $container.removeClass('d-none');
        let posterPath = movie.poster_path ?
            configs.imgBase + 'w500' + movie.poster_path :
            configs.imgBase + 'w1280' + movie.backdrop_path;

        let card = `
                <div class="col-lg-3 col-md-6 col-sm-6 mb-4">
                    <div class="card h-100" title="${movie.title}">
                        <img src="${posterPath}" class="card-img-top" alt="${movie.title}">
                        <div class="card-body">
                            <h5 class="card-title">${movie.title.length > 20 ? movie.title.slice(0, 18) + '...' : movie.title}</h5>
                            <h6 class="movie-rate">${movie.vote_average.toFixed(1)}/10</h6>
                        </div>
                        <a href="#" class="view" data-id="${movie.id}">View</a>
                        <a href="#" class="toggle_watchlist" data-id="${movie.id}"><i class="fa-regular fa-clock"></i></a>
                        <a href="#" class="toggle_fav" data-id="${movie.id}"><i class="fa-regular fa-heart"></i></a>

                    </div>
                </div>`;

        $container.append(card);
        update_watchlist();
        update_fav();
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

        $.each(movie_list.slice(0, 48), function (key, movie) {
            let posterPath = movie.poster_path ?
                configs.imgBase + 'w500' + movie.poster_path :
                configs.imgBase + 'w1280' + movie.backdrop_path;


            let card = `
                    <div class="col-lg-3 col-md-6 col-sm-6 mb-4">
                        <div class="card h-100" title="${movie.title}">
                            <img src="${posterPath}" class="card-img-top" alt="${movie.title}">
                            <div class="card-body">
                                <h5 class="card-title">${movie.title.length > 20 ? movie.title.slice(0, 18) + '...' : movie.title}</h5>
                            <h6 class="movie-rate">${movie.vote_average.toFixed(1)}/10</h6>
                        </div>
                        <a href="#" class="view" data-id="${movie.id}">View</a>
                        <a href="#" class="toggle_watchlist" data-id="${movie.id}"><i class="fa-regular fa-clock"></i></a>
                        <a href="#" class="toggle_fav" data-id="${movie.id}"><i class="fa-regular fa-heart"></i></a>

                    </div>
                </div>`;
            $container.append(card);
            update_watchlist();
            update_fav();
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


function toggle_LS(movie_id, list_type) {
    movie_id = Number(movie_id);
    if (list_type === 'watchlist') {
        let watchlist = JSON.parse(localStorage.getItem('watchlist')) || [];
        let index = watchlist.indexOf(movie_id);

        if (index === -1) {
            watchlist.push(movie_id);
        } else {
            watchlist.splice(index, 1);
        }

        localStorage.setItem('watchlist', JSON.stringify(watchlist));
    }
    else {
        let fav = JSON.parse(localStorage.getItem('fav')) || [];
        let index = fav.indexOf(movie_id);

        if (index === -1) {
            fav.push(movie_id);

        } else {
            fav.splice(index, 1);
        }

        localStorage.setItem('fav', JSON.stringify(fav));

    }


}
function check_icon(movieId) {

    let watchlist =
        JSON.parse(localStorage.getItem('watchlist')) || []

        , fav =
            JSON.parse(localStorage.getItem('fav')) || []

        , $watchBtn =
            $(`.toggle_watchlist[data-id="${movieId}"]`)

        , $favBtn =
            $(`.toggle_fav[data-id="${movieId}"]`);

    if (watchlist.map(String).includes(String(movieId))) {

        $watchBtn.find('i')
            .removeClass('fa-regular')
            .addClass('fa-solid');

    } else {

        $watchBtn.find('i')
            .removeClass('fa-solid')
            .addClass('fa-regular');
    }

    if (fav.map(String).includes(String(movieId))) {

        $favBtn.find('i')
            .removeClass('fa-regular')
            .addClass('fa-solid');

    } else {

        $favBtn.find('i')
            .removeClass('fa-solid')
            .addClass('fa-regular');
    }
}
async function update_watchlist() {
    let $container = $(`.watchlist .movie_list`);
    $container.empty();

    let watchlist = JSON.parse(localStorage.getItem('watchlist')) || [];

    for (let movie_id of watchlist) {
        await add_ToList(movie_id, $container);

    }
}
async function update_fav() {
    let $container = $(`.favourits .movie_list`);
    $container.empty();

    let fav = JSON.parse(localStorage.getItem('fav')) || [];

    for (let movie_id of fav) {
        await add_ToList(movie_id, $container);



    }

}

async function add_ToList(movie_id, $container) {
    let id = Number(movie_id);
    let movie = await get_lists(
        configs.endpoints.movieDetails(movie_id),
        'GET'
    );
    console.log(movie);
    if (!movie) {
        console.error(`API Error: No data returned for movie ID: ${movie_id}. Check your endpoint or API key.`);
        return;
    }

    let posterPath = movie.poster_path ?
        configs.imgBase + 'w500' + movie.poster_path :
        configs.imgBase + 'w1280' + movie.backdrop_path;

    let card = `
        <div class="col-lg-3 col-md-6 col-sm-6 mb-4">
            <div class="card h-100">
                <img src="${posterPath}" class="card-img-top" alt="${movie.title}">
                <div class="card-body">
                    <h5 class="card-title">${movie.title.length > 20 ? movie.title.slice(0, 18) + '...' : movie.title}</h5>
                    <h6 class="movie-rate">${movie.vote_average.toFixed(1)}/10</h6>
                </div>
                <a href="#" class="view" data-id="${movie.id}">View</a>
                <a href="#" class="toggle_watchlist" data-id="${movie.id}"><i class="fa-regular fa-clock"></i></a>
                <a href="#" class="toggle_fav" data-id="${movie.id}"><i class="fa-regular fa-heart"></i></a>
            </div>
        </div>`;

    $container.append(card);
    check_icon(movie.id);

}

async function movie_details(movieId) {
    let $view = $('.view_movie'),
        movie = await get_lists(
            configs.endpoints.movieDetails(movieId),
            {
                append_to_response: 'credits,reviews,videos'
            },
            'GET'
        );

    let posterPath = movie.poster_path
        ? `${configs.imgBase}w500${movie.poster_path}`
        : `${configs.imgBase}w500${movie.backdrop_path}`;
    let backdrop_path = movie.backdrop_path
        ? `${configs.imgBase}w500${movie.backdrop_path}`
        : `${configs.imgBase}w500${movie.poster_path}`;

    $view.find('.poster')
        .attr('src', posterPath)
        .attr('alt', movie.title);
    $view.find('.movie-box').css('background-image', ` url("${backdrop_path}")`);


    $view.find('.movie-title p').text(movie.title);
    $view.find('.title-again').text(movie.title);

    $view.find('.boxx h3 span')
        .text(`${movie.vote_average.toFixed(2)}/10`);

    $view.find('.release-date')
        .text(movie.release_date);
    $view.find('.toggle_watchlist')
        .attr('data-id', movie.id);
    $view.find('.toggle_fav')
        .attr('data-id', movie.id);

    $view.find('.overview')
        .next('p')
        .text(movie.overview || 'No overview available.');
    load_Reviews(movieId);
    show_cast(movie.credits.cast);
    show_reviews(movie.reviews.results, movieId);
    show_trailer(movie.videos.results);
    check_icon(movieId)

    $('.view_movie').attr('data-id', movieId);


}

function show_cast(cast) {

    let $container = $('.casting .cards');

    $container.empty();

    cast.slice(0, 8).forEach(actor => {

        let img = actor.profile_path
            ? `${configs.imgBase}w185${actor.profile_path}`
            : 'images/main/cat-sleep.png';

        $container.append(`
            <div class="actor-card">
                <img src="${img}" alt="${actor.name}" class="actor-profile">

                <h5 class="character-name">
                    ${actor.character}
                </h5>

                <h6 class="actor-name">
                    ${actor.name}
                </h6>
            </div>
        `);

    });

}
function show_reviews(reviews, movieId) {

    let $reviews = $('.reviews-list');

    $reviews.empty();

    if (!reviews.length) {

        $reviews.append(`
            <div class="review-card">
                No reviews available.
            </div>
        `);

        return;
    }

    reviews.slice(0, 25).forEach(review => {

        $reviews.append(`
            <div class="review">
                <div class="review-card">

                    <div class="reviewer-info">
                        <img src="${review.author_details.avatar_path ? review.author_details.avatar_path.startsWith('/https') ? review.author_details.avatar_path.slice(1) : configs.imgBase + 'w185' + review.author_details.avatar_path : 'images/main/cat-sleep.png'}" alt="${review.author}"
                             class="reviewer-profile">

                        <h5 class="reviewer-name">
                            ${review.author}
                        </h5>
                    </div>

                    <p class="review-content">
                        ${review.content.substring(0, 500)}...
                    </p>

                </div>
            </div>
        `);

    });
    load_Reviews(movieId)
}

function show_trailer(videos) {

    const trailer = videos.find(video =>
        video.site === "YouTube" &&
        video.type === "Trailer"
    );

    if (trailer) {

        $('.teaser')
            .attr('data-key', trailer.key);

    } else {

        $('.teaser')
            .attr('data-key', '');

    }
}
function init_user() {

    let user = getStoredUser();

    if (user) {
        showUserProfile(user);
    } else {
        showRegistrationForm();
    }

    updateNavbarUser();
}

function getStoredUser() {

    let user = localStorage.getItem("user_dataa");

    return user ? JSON.parse(user) : null;
}
function validateInput($input) {

    let value = $input.val().trim();
    let name = $input.attr("name");
    let errorMessage = "Invalid value";

    if (!name) return true;

    let $error =
        $(`[data-error-name="${name}"]`);

    let regex;

    switch (name) {


        case "firstName":
        case "lastName":
            regex = /^[A-Za-z]{3,}$/;
            errorMessage =
                "Name must contain at least 3 letters and only alphabetic characters.";
            break;

        case "email":
            regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            errorMessage =
                "Please enter a valid email address (example: jana@gmail.com).";
            break;
        case "password":
            regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
            errorMessage =
                "Password must be at least 8 characters and contain an uppercase letter, a lowercase letter, and a number.";
            break;

    }

    if (value === "") {

        $error
            .removeClass("d-none")
            .text("This field is required");

        return false;
    }

    if (!regex.test(value)) {

        $error
            .removeClass("d-none")
            .text(errorMessage);

        return false;
    }

    $error.addClass("d-none");

    return true;
}

function validateForm() {

    let valid = true;

    $(".data input").each(function () {

        if (!validateInput($(this))) {
            valid = false;
        }

    });

    return valid;
}

function submitForm() {
    let currentTheme = localStorage.getItem('theme') || 'light';


    if (!validateForm()) return;

    let firstName =
        $('[name="firstName"]').val().trim();

    let lastName =
        $('[name="lastName"]').val().trim();

    let email =
        $('[name="email"]').val().trim();

    let file =
        $("#profilePic")[0].files[0];

    if (file) {
        Swal.mixin({
            toast: true,
            position: "top-end",
            showConfirmButton: false,
            timer: 3000,
            theme: `${currentTheme}`,
            timerProgressBar: true,
            didOpen: (toast) => {
                toast.onmouseenter = Swal.stopTimer;
                toast.onmouseleave = Swal.resumeTimer;
            }
        }).fire({
            icon: "success",
            title: "Signed in successfully"
        });

        let reader = new FileReader();

        reader.onload = function (e) {

            saveUser({
                firstName,
                lastName,
                full_Name:
                    `${firstName} ${lastName}`,
                email,
                profilePic: e.target.result
            });

        };

        reader.readAsDataURL(file);

    } else {
        Swal.mixin({
            toast: true,
            position: "top-end",
            showConfirmButton: false,
            timer: 3000,
            theme: `${currentTheme}`,
            timerProgressBar: true,
            didOpen: (toast) => {
                toast.onmouseenter = Swal.stopTimer;
                toast.onmouseleave = Swal.resumeTimer;
            }
        }).fire({
            icon: "success",
            title: "Signed in successfully"
        });

        saveUser({
            firstName,
            lastName,
            full_Name:
                `${firstName} ${lastName}`,
            email,
            profilePic:
                "images/main/login-cat.png"
        });

    }
}

function saveUser(user) {

    localStorage.setItem(
        "user_dataa",
        JSON.stringify(user)
    );

    showUserProfile(user);

    updateNavbarUser();
}

function showRegistrationForm() {

    $(".head").show();

    $(".data")
        .css("display", "flex");

    $(".sign-up")
        .css("display", "flex");

    $(".user-display").hide();
}

function showUserProfile(user) {

    $(".head").hide();

    $(".data").hide();

    $(".sign-up").hide();

    $(".user-display").show();

    $(".user-info").html(`

        <div class="profile-card">

            <img
                src="${user.profilePic}"
                class="profile-img">

            <h3>${user.full_Name}</h3>

            <p>${user.email}</p>

            <button
                id="logoutBtn"
                class="logout-btn">

                Logout

            </button>

        </div>

    `);
}

function logoutUser() {
    let currentTheme = localStorage.getItem('theme') || 'light';

    Swal.fire({
        title: "Are you sure?",
        text: "You will be logged out of your account.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "rgb(112, 11, 78)",
        cancelButtonColor: "#44174a",
        confirmButtonText: "Yes, log out",
        cancelButtonText: "Cancel",
        theme: `${currentTheme}`

    }).then((result) => {
        if (result.isConfirmed) {
            localStorage.removeItem("user_dataa");

            $(".data")[0].reset();

            $("p.alert")
                .addClass("d-none")
                .text("");

            showRegistrationForm();
            updateNavbarUser();

            Swal.fire({
                title: "Logged Out!",
                text: "You have been logged out successfully.",
                icon: "success",
                theme: `${currentTheme}`
            });
        }
    });
}

function updateNavbarUser() {

    let user = getStoredUser();

    let $btn = $(".login_popup");

    if (user) {

        $btn.html(`
            <img
                src="${user.profilePic}"
                style="
                    width:35px;
                    height:35px;
                    border-radius:50%;
                    object-fit:cover;
                ">
        `);

    } else {

        $btn.text("Register");
    }
}

function checkWatchlistEmpty() {

    let watchlist =
        JSON.parse(localStorage.getItem('watchlist')) || [];

    if (watchlist.length === 0) {

        $('.empty-list').css('display', 'block');
        $('#watchlist .movie_list').css('display', 'none');

    } else {

        $('.empty-list').css('display', 'none');
        $('#watchlist .movie_list').css('display', 'flex');

    }
}
function checkFavoritesEmpty() {

    let favorites =
        JSON.parse(localStorage.getItem('fav')) || [];

    if (favorites.length === 0) {

        $('.empty-list-fav').css('display', 'block');
        $('#favorites .movie_list').css('display', 'none');

    } else {

        $('.empty-list-fav').css('display', 'none');
        $('#favorites .movie_list').css('display', 'flex');

    }
}

function write_review() {
    let currentTheme = localStorage.getItem('theme') || 'light';
    let user =
        JSON.parse(
            localStorage.getItem(
                'user_dataa'
            )
        );

    if (!user) {
        Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Please register first.",
            showDenyButton: true,
            confirmButtonText: "OK",
            denyButtonText: "Register",
            theme: `${currentTheme}`
        }).then((result) => {
            if (result.isDenied) {
                $('#login').addClass('active');

            }
        });

        return;
    }

    const reviewText =
        $('.review-input')
            .val()
            .trim();

    if (reviewText === '') {
        let timerInterval;
        Swal.fire({
            title: "Please write a review!",
            html: "I will close in <b></b> milliseconds.",
            timer: 2000,
            timerProgressBar: true,
            theme: `${currentTheme}`,
            didOpen: () => {
                Swal.showLoading();
                const timer = Swal.getPopup().querySelector("b");
                timerInterval = setInterval(() => {
                    timer.textContent = `${Swal.getTimerLeft()}`;
                }, 100);
            },
            willClose: () => {
                clearInterval(timerInterval);
            }
        }).then((result) => {
            if (result.dismiss === Swal.DismissReason.timer) console.log("I was closed by the timer");
        });



        return;
    }

    let movieId = $('.view_movie').attr('data-id');

    saveReview(
        movieId,
        user,
        reviewText
    );

    $('.review-input').val('');

    load_Reviews(movieId);
}

function saveReview(movieId, user, reviewText) {

    let reviews =
        JSON.parse(
            localStorage.getItem(
                'reviews'
            )
        ) || {};

    if (!reviews[movieId]) {

        reviews[movieId] = [];
    }

    reviews[movieId].unshift({
        id: Date.now(),
        user: user.full_Name,
        email: user.email,
        profilePic:
            user.profilePic,
        review: reviewText
    });

    localStorage.setItem(
        'reviews',
        JSON.stringify(reviews)
    );
}

function load_Reviews(movieId) {

    let reviews =
        JSON.parse(
            localStorage.getItem(
                'reviews'
            )
        ) || {};

    let movieReviews =
        reviews[movieId] || [];

    let $container =
        $('.reviews-list');

    $('.local-review')
        .remove();
    const currentUser =
        JSON.parse(localStorage.getItem('user_dataa'));

    movieReviews.forEach(review => {

        let deleteBtn = '';

        if (
            currentUser &&
            currentUser.email === review.email
        ) {
            deleteBtn = `
            <button
                class="delete-review"
                data-movie-id="${movieId}"
                data-review-id="${review.id}">
                <i class="fa-solid fa-trash"></i>
            </button>
        `;
        }

        $container.append(`
        <div class="review local-review">

            <div class="review-card">

                <div class="reviewer-info">

                    <img
                        src="${review.profilePic}"
                        class="reviewer-profile">

                    <h5>${review.user}</h5>

                </div>

                <p>${review.review}</p>

                ${deleteBtn}

            </div>

        </div>
    `);
    });

}

function delete_review(movieId, reviewId) {

    let reviews =
        JSON.parse(localStorage.getItem('reviews')) || {};

    if (!reviews[movieId]) return;

    reviews[movieId] =
        reviews[movieId].filter(
            review => review.id != reviewId
        );

    localStorage.setItem(
        'reviews',
        JSON.stringify(reviews)
    );
}


function update_theme() {
    let currentTheme =
        localStorage.getItem('theme') || 'light';

    if (currentTheme === 'dark') {

        $('body').addClass('dark');

        $('#mode').prop(
            'checked',
            true
        );

    } else {

        $('body').removeClass('dark');

        $('#mode').prop(
            'checked',
            false
        );
    }
}