# Movie-website
# 🎬 CatFlix — TMDB Movie Web Application

A frontend movie-discovery application built with **HTML, CSS/SCSS, JavaScript, jQuery, Bootstrap, Swiper.js, SweetAlert2, and The Movie Database (TMDB) API**.

The purpose of this README is not only to document CatFlix, but also to serve as a **reference for anyone who wants to build a similar movie/API-based frontend project**.

It explains:

- How the TMDB API is structured and consumed
- How API configuration is organized
- How URLs and query parameters are generated
- How reusable API functions are designed
- How TMDB movie objects are used
- How filtering and searching work
- How movie details, cast, reviews, and trailers are retrieved
- How `localStorage` is used for application state
- How event delegation works with dynamically generated movie cards
- How the UI is generated from API data
- How the different functions communicate with each other
- What can be improved in a production version

---

# 📌 Table of Contents

1. [Project Overview](#-project-overview)
2. [Main Technologies](#-main-technologies)
3. [Application Architecture](#-application-architecture)
4. [How TMDB API Works](#-how-tmdb-api-works)
5. [The Configuration Object](#-the-configuration-object)
6. [Building API URLs](#-building-api-urls)
7. [The Main API Request Function](#-the-main-api-request-function)
8. [Understanding TMDB Response Objects](#-understanding-tmdb-response-objects)
9. [Genres Object](#-genres-object)
10. [Displaying Movies](#-displaying-movies)
11. [Trending Movies](#-trending-movies)
12. [Popular Movies by Genre](#-popular-movies-by-genre)
13. [Top Rated Movies](#-top-rated-movies)
14. [Filtering Movies](#-filtering-movies)
15. [Movie Search](#-movie-search)
16. [Movie Details](#-movie-details)
17. [Credits / Cast](#-credits--cast)
18. [Reviews](#-reviews)
19. [Trailers](#-trailers)
20. [Watchlist and Favorites](#-watchlist-and-favorites)
21. [localStorage as Application State](#-localstorage-as-application-state)
22. [Event Delegation](#-event-delegation)
23. [User Registration](#-user-registration)
24. [Theme System](#-theme-system)
25. [Loading State](#-loading-state)
26. [Function Reference](#-function-reference)
27. [Complete Data Flow](#-complete-data-flow)


---

# 🎬 Project Overview

CatFlix is a movie browsing application that consumes data from the **TMDB API** and transforms the returned JSON data into interactive movie cards and movie-detail pages.

The application provides several ways to discover movies:

- Trending movies
- Popular movies
- Top-rated movies
- Movies by genre
- Movies by language
- Movies by certification/age category
- Search results
- Movie details
- Cast
- Reviews
- Trailers

It also provides client-side functionality for:

- Favorites
- Watchlist
- User registration
- Profile picture
- User reviews
- Light/dark mode
- Movie-detail navigation

The HTML contains separate UI sections for trending, recommendations, top-rated, popular movies, filters, search results, watchlist, favorites, and authentication. 

---

# 🛠 Main Technologies

## Frontend

- HTML5
- CSS / SCSS
- JavaScript
- jQuery
- Bootstrap

## External Libraries

- Swiper.js — movie sliders/carousels
- SweetAlert2 — alerts and notifications
- Font Awesome — icons
- Lordicon — animated icons

## API

- The Movie Database (TMDB)

## Browser Storage

- `localStorage`

---

# 🏗 Application Architecture

The project can be thought of as several layers:

```text
                    ┌──────────────────────┐
                    │      TMDB API        │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │    get_lists()       │
                    │  API communication    │
                    └──────────┬───────────┘
                               │
                 ┌─────────────┼──────────────┐
                 ▼             ▼              ▼
          trending_show() popular_show() top_rated_show()
                 │             │              │
                 └─────────────┼──────────────┘
                               ▼
                       Movie card HTML
                               │
                               ▼
                         User interface
                               │
                 ┌─────────────┼─────────────┐
                 ▼             ▼             ▼
             Favorites     Watchlist       Details
                 │             │             │
                 └─────────────┼─────────────┘
                               ▼
                         localStorage
```

The important architectural idea is:

> **Do not make every part of the application responsible for communicating directly with the API.**

Instead, centralize API communication inside reusable functions.

In this project, `get_lists()` is the main reusable API request layer.

---

#  How TMDB API Works

The application communicates with TMDB using HTTP requests.

A typical request looks conceptually like:

```text
GET
https://api.themoviedb.org/3/movie/popular
```

with query parameters such as:

```text
?language=en-US
&page=1
&include_adult=false
&region=US
```

The API returns JSON.

For example, conceptually:

```json
{
    "page": 1,
    "results": [
        {
            "id": 123,
            "title": "Example Movie",
            "poster_path": "/abc.jpg",
            "backdrop_path": "/xyz.jpg",
            "vote_average": 8.2,
            "overview": "Movie description..."
        }
    ],
    "total_pages": 100,
    "total_results": 2000
}
```

The important part is:

```javascript
response.results
```

because list endpoints return the movies inside the `results` array.

---

# ⚙️ The Configuration Object

One of the most important design decisions in the project is putting API-related information into one object:

```javascript
const configs = {
    baseUrl: 'https://api.themoviedb.org/3',

    imgBase: 'https://image.tmdb.org/t/p/',

    accountId: '23070170',

    session_id: '...',

    endpoints: {
        trending: '/trending/movie/day',
        discover: '/discover/movie',
        popular: '/movie/popular',
        topRated: '/movie/top_rated',
        search: '/search/movie',

        movieDetails: (id) => `/movie/${id}`,
        recommendations: (id) => `/movie/${id}/recommendations`,

        watchlist: (accId) =>
            `/account/${accId}/watchlist`,

        accountStates: (id) =>
            `/movie/${id}/account_states`
    },

    defaults: {
        language: 'en-US',
        page: 1,
        include_adult: false,
        certification_country: 'US',
        'certification.lte': 'G',
        region: 'US'
    },

    headers: {
        accept: 'application/json',
        Authorization: 'Bearer YOUR_TOKEN'
    }
};
```

This object is essentially the application's **API configuration layer**.

---

# 🧩 Why Use a Configuration Object?

Without this structure, you might repeatedly write:

```javascript
$.ajax({
    url: 'https://api.themoviedb.org/3/movie/popular',
    ...
});
```

and then:

```javascript
$.ajax({
    url: 'https://api.themoviedb.org/3/trending/movie/day',
    ...
});
```

and:

```javascript
$.ajax({
    url: 'https://api.themoviedb.org/3/search/movie',
    ...
});
```

That creates duplicated information.

Instead:

```javascript
configs.endpoints.popular
configs.endpoints.trending
configs.endpoints.search
```

can be used.

This gives you a central place to change the API configuration.

---

#  Understanding the Nested Objects

The `configs` object contains several smaller objects.

## `baseUrl`

```javascript
baseUrl: 'https://api.themoviedb.org/3'
```

This is the root of the TMDB API.

---

## `imgBase`

```javascript
imgBase: 'https://image.tmdb.org/t/p/'
```

TMDB movie objects don't normally give you a complete poster URL.

They give you something such as:

```text
/poster123.jpg
```

You combine that with:

```text
https://image.tmdb.org/t/p/
```

and an image size.

For example:

```javascript
configs.imgBase + 'w500' + movie.poster_path
```

becomes:

```text
https://image.tmdb.org/t/p/w500/poster123.jpg
```

---

# 🔌 Endpoints Object

The endpoint object stores API routes:

```javascript
endpoints: {
    trending: '/trending/movie/day',
    discover: '/discover/movie',
    popular: '/movie/popular',
    topRated: '/movie/top_rated',
    search: '/search/movie'
}
```

There are also dynamic endpoints:

```javascript
movieDetails: (id) => `/movie/${id}`
```

This is a function because the movie ID changes.

For example:

```javascript
configs.endpoints.movieDetails(550)
```

returns:

```text
/movie/550
```

This is much cleaner than manually constructing URLs everywhere.

---

# 🔧 Default Parameters

The `defaults` object contains parameters that should normally be sent with requests:

```javascript
defaults: {
    language: 'en-US',
    page: 1,
    include_adult: false,
    certification_country: 'US',
    'certification.lte': 'G',
    region: 'US'
}
```

This is useful because many API requests share the same parameters.

Instead of repeatedly doing:

```javascript
{
    language: 'en-US',
    page: 1,
    include_adult: false
}
```

you define them once.

---

#  Building API URLs

The project uses:

```javascript
function build_url(endpoint, new_params = {}) {
    let url = new URL(configs.baseUrl + endpoint);

    let final_params = Object.assign(
        {},
        configs.defaults,
        new_params
    );

    Object.keys(final_params).forEach(key => {
        url.searchParams.append(
            key,
            final_params[key]
        );
    });

    return url.toString();
}
```

This function is extremely important.

## Step 1 — Combine base URL and endpoint

Suppose:

```javascript
endpoint = '/movie/popular'
```

Then:

```javascript
configs.baseUrl + endpoint
```

becomes:

```text
https://api.themoviedb.org/3/movie/popular
```

---

## Step 2 — Combine default and custom parameters

Suppose:

```javascript
configs.defaults
```

contains:

```javascript
{
    language: 'en-US',
    page: 1
}
```

and we pass:

```javascript
{
    query: 'Batman'
}
```

Then:

```javascript
Object.assign(
    {},
    configs.defaults,
    new_params
)
```

produces approximately:

```javascript
{
    language: 'en-US',
    page: 1,
    query: 'Batman'
}
```

---

## Step 3 — Convert object properties into query parameters

This:

```javascript
{
    language: 'en-US',
    page: 1,
    query: 'Batman'
}
```

becomes:

```text
?language=en-US&page=1&query=Batman
```

using:

```javascript
url.searchParams.append(...)
```

This is much safer and cleaner than manually concatenating:

```javascript
'?language=' + language + '&page=' + page
```

---

#  The Main API Request Function

The main reusable function is:

```javascript
async function get_lists(endpoint, params, method) {
    let final_url = build_url(endpoint, params);

    $activeRequests++;

    if ($activeRequests === 1) {
        $loadingModal.show();
    }

    try {
        let response = await $.ajax({
            url: final_url,
            method,
            headers: configs.headers
        });

        return response.results
            ? response.results
            : response;

    } catch (err) {

        console.error(
            "Fetch error:",
            err
        );

    } finally {

        $activeRequests--;

        if ($activeRequests === 0) {
            setTimeout(() => {
                $loadingModal.hide();
            }, 500);
        }
    }
}
```

This is effectively your application's **API abstraction function**.

Instead of every function calling `$.ajax()` independently, most functions call:

```javascript
get_lists(...)
```

---

#  API Request Flow

For example:

```javascript
let movie_list = await get_lists(
    configs.endpoints.popular,
    {},
    'GET'
);
```

The flow is:

```text
popular_show()
      │
      ▼
get_lists()
      │
      ▼
build_url()
      │
      ▼
Final URL
      │
      ▼
$.ajax()
      │
      ▼
TMDB API
      │
      ▼
JSON response
      │
      ▼
response.results
      │
      ▼
movie_list
```

This is one of the most important concepts to understand when building API-driven applications.

---

#  Why `response.results ? response.results : response`?

List endpoints generally return:

```javascript
{
    results: [...]
}
```

while a movie-details endpoint returns the movie object directly:

```javascript
{
    id: 550,
    title: "...",
    overview: "...",
    ...
}
```

Therefore:

```javascript
return response.results
    ? response.results
    : response;
```

allows the same function to handle both cases.

### List request

```text
response
 ├── page
 ├── results
 │    ├── movie
 │    ├── movie
 │    └── movie
 └── total_results
```

returns:

```javascript
response.results
```

### Details request

```text
response
 ├── id
 ├── title
 ├── overview
 ├── credits
 ├── reviews
 └── videos
```

has no `results`, so the complete response is returned.

---

#  Understanding TMDB Movie Objects

A movie returned by TMDB is an object.

For example:

```javascript
movie = {
    id: 550,

    title: "Fight Club",

    overview: "...",

    poster_path: "/abc.jpg",

    backdrop_path: "/xyz.jpg",

    release_date: "1999-10-15",

    vote_average: 8.4
};
```

The project accesses these properties directly:

```javascript
movie.id
movie.title
movie.poster_path
movie.backdrop_path
movie.vote_average
movie.release_date
movie.overview
```

This is a fundamental JavaScript concept:

> API JSON becomes JavaScript objects after the response is parsed.

---

#  Working With Movie Images

TMDB gives image paths rather than complete URLs.

For posters:

```javascript
let posterPath = movie.poster_path
    ? configs.imgBase + 'w500' + movie.poster_path
    : configs.imgBase + 'w500' + movie.backdrop_path;
```

This uses the poster when available.

If there is no poster:

```javascript
movie.poster_path === null
```

the application falls back to the backdrop.

Conceptually:

```text
poster_path exists?
       │
   ┌───┴────┐
   │        │
  YES      NO
   │        │
poster    backdrop
```

This pattern appears throughout the application.

---

#  Genres Object

The application defines a local genre mapping:

```javascript
const genres = {
    Action: {
        id: 28,
        name: "Action"
    },

    Animation: {
        id: 16,
        name: "Animation"
    },

    Comedy: {
        id: 35,
        name: "Comedy"
    },

    Horror: {
        id: 27,
        name: "Horror"
    },

    Fantasy: {
        id: 14,
        name: "Fantasy"
    }
};
```

The important idea is that the UI has human-readable names while the API needs numeric IDs.

For example:

```text
User selects:
Action

        ↓

genres["Action"]

        ↓

{
    id: 28,
    name: "Action"
}

        ↓

TMDB receives:

with_genres=28
```

This is a good example of using a JavaScript object as a **mapping layer** between the UI and API.

---

# 🔥 Popular Movies by Genre

The function:

```javascript
async function popular_show()
```

uses:

```javascript
let genresToShow = [
    'Action',
    'Family',
    'Comdey',
    'Animation'
];
```

Then:

```javascript
for (let name of genresToShow)
```

loops through those categories.

For every genre:

```javascript
let movie_list = await get_lists(
    configs.endpoints.discover,
    {
        sort_by: 'popularity.desc',
        with_genres: `${genres[name].id}`
    },
    'GET'
);
```

Notice the important relationship:

```javascript
genres[name].id
```

If:

```javascript
name = "Action"
```

then:

```javascript
genres["Action"].id
```

returns:

```text
28
```

The request therefore becomes conceptually:

```text
/discover/movie
    ?sort_by=popularity.desc
    &with_genres=28
```

The returned movies are then converted into HTML cards.

---

# 📈 Trending Movies

The function:

```javascript
trending_show()
```

calls:

```javascript
get_lists(
    configs.endpoints.trending,
    'GET'
);
```

The resulting movies are inserted into:

```javascript
.mySwiper .swiper-wrapper
```

The function takes the first ten:

```javascript
movie_list.slice(0, 10)
```

and creates Swiper slides.

Each slide contains:

- Movie image
- Movie title
- View button
- Movie ID

The movie ID is stored in:

```html
data-id="${movie.id}"
```

This is important because the UI later needs to know which movie the user clicked.

---

#  Top Rated Movies

`top_rated_show()` follows almost the same pattern.

It requests:

```javascript
configs.endpoints.topRated
```

then creates slides from the returned movie objects.

The rating is displayed using:

```javascript
movie.vote_average.toFixed(1)
```

For example:

```text
8.4
```

becomes:

```text
8.4/10
```

---

# 🔎 Filtering Movies

The filtering function:

```javascript
async function filter()
```

reads checked inputs from three groups:

```javascript
#nav-genre input:checked

#nav-Language input:checked

#nav-age input:checked
```

The UI itself contains genre, language, and age/certification inputs. 

---

## Step 1 — Collect genres

```javascript
$genre_checked.each(function () {

    let id = $(this).attr('id');

    if (genres[id]) {
        selected_genres.push(
            genres[id].id
        );
    }

});
```

Suppose the user selects:

```text
Action
Animation
```

The application converts them into:

```javascript
[
    28,
    16
]
```

---

## Step 2 — Convert array to API format

```javascript
selected_genres.join(',')
```

becomes:

```text
28,16
```

which can be passed to:

```text
with_genres=28,16
```

---

#  Filtering by Language

The language input IDs correspond to TMDB language codes.

For example:

```html
<input name="en" id="en">
```

The JavaScript reads:

```javascript
$(this).attr('id')
```

and produces:

```javascript
selected_lang.push($(this).attr('id'));
```

Eventually:

```javascript
with_original_language: selected_lang.join(',')
```

is sent to TMDB.

---

#  Certification Filtering

The age filter reads:

```javascript
selected_age = $(this).val();
```

Then:

```javascript
"certification.lte": selected_age
```

is added to the API parameters.

The project also defaults to:

```javascript
'G'
```

when no certification value has been selected.

---

#  Movie Search

The search function:

```javascript
async function searchin()
```

gets the search text:

```javascript
let search = $search_in.val().trim();
```

If the input isn't empty:

```javascript
get_lists(
    configs.endpoints.search,
    {
        query: search,
        include_adult: false,
        certification_country: "US",
        "certification.lte": "G"
    },
    'GET'
);
```

The search text becomes the `query` parameter.

For:

```text
Batman
```

the request conceptually becomes:

```text
/search/movie?query=Batman
```

The UI then hides the normal sections and displays the search-result container.

---

# Returning Home

The:

```javascript
back_home()
```

function restores the normal application state.

It:

```javascript
$search_in.val('');
```

clears the search field.

Then:

```javascript
$container.addClass('d-none').empty();
```

hides and clears search results.

And:

```javascript
$('section').removeClass('d-none');
```

restores the normal sections.

This is a simple example of managing UI state manually with jQuery.

---

# 🎥 Movie Details

The most important detail function is:

```javascript
async function movie_details(movieId)
```

It calls:

```javascript
get_lists(
    configs.endpoints.movieDetails(movieId),
    {
        append_to_response:
            'credits,reviews,videos'
    },
    'GET'
);
```

This is an especially useful TMDB technique.

Instead of separately requesting:

```text
/movie/{id}
```

then:

```text
/movie/{id}/credits
```

then:

```text
/movie/{id}/reviews
```

then:

```text
/movie/{id}/videos
```

the application requests the movie details while asking TMDB to append related data.

Conceptually:

```text
Movie Details
      │
      ├── Basic movie information
      │
      ├── credits
      │
      ├── reviews
      │
      └── videos
```

This gives the application a richer movie object.

---

#  The Expanded Movie Object

After:

```javascript
append_to_response:
    'credits,reviews,videos'
```

the movie object can conceptually look like:

```javascript
movie = {
    id: 550,

    title: "...",

    overview: "...",

    poster_path: "...",

    backdrop_path: "...",

    release_date: "...",

    vote_average: 8.4,

    credits: {
        cast: [...]
    },

    reviews: {
        results: [...]
    },

    videos: {
        results: [...]
    }
};
```

This is why the code can do:

```javascript
movie.credits.cast
```

and:

```javascript
movie.reviews.results
```

and:

```javascript
movie.videos.results
```

---

# 👥 Cast

The function:

```javascript
show_cast(cast)
```

receives:

```javascript
movie.credits.cast
```

It only displays the first eight:

```javascript
cast.slice(0, 8)
```

For each actor:

```javascript
actor.profile_path
actor.name
actor.character
```

are used.

The profile image is constructed using:

```javascript
configs.imgBase + 'w185' + actor.profile_path
```

If no profile image exists:

```javascript
'images/main/cat-sleep.png'
```

is used as a fallback.

---

#  Reviews

There are two review sources in the project.

## 1. TMDB reviews

TMDB reviews are displayed using:

```javascript
show_reviews(
    movie.reviews.results,
    movieId
);
```

The application limits them:

```javascript
reviews.slice(0, 25)
```

and limits the displayed text:

```javascript
review.content.substring(0, 500)
```

---

## 2. Local user reviews

The application also creates its own reviews using:

```javascript
localStorage
```

The structure is:

```javascript
{
    movieId: [
        {
            id: 123456789,
            user: "User Name",
            email: "user@example.com",
            profilePic: "...",
            review: "My review..."
        }
    ]
}
```

This is an important object structure.

The movie ID becomes the key:

```javascript
reviews[movieId]
```

Therefore every movie gets its own review array.

---

# ✍️ Writing a Review

The flow is:

```text
User clicks Write Review
          │
          ▼
write_review()
          │
          ▼
Is user registered?
      │          │
     NO         YES
      │          │
      ▼          ▼
Show alert   Read textarea
                  │
                  ▼
             saveReview()
                  │
                  ▼
             localStorage
                  │
                  ▼
             load_Reviews()
```

The project prevents review submission if no user is stored.

---

# 💾 Saving Reviews

The function:

```javascript
saveReview(
    movieId,
    user,
    reviewText
)
```

gets the existing review object:

```javascript
let reviews =
    JSON.parse(
        localStorage.getItem('reviews')
    ) || {};
```

Then:

```javascript
if (!reviews[movieId]) {
    reviews[movieId] = [];
}
```

creates the movie's review array if it doesn't exist.

A review is then inserted using:

```javascript
reviews[movieId].unshift(...)
```

Using `unshift()` means the newest review appears first.

Finally:

```javascript
localStorage.setItem(
    'reviews',
    JSON.stringify(reviews)
);
```

persists the data.

---

# 🗑 Deleting Reviews

The project identifies the review using:

```javascript
review.id
```

and removes it using:

```javascript
filter()
```

Conceptually:

```javascript
reviews[movieId] =
    reviews[movieId].filter(
        review => review.id != reviewId
    );
```

The application also checks:

```javascript
currentUser.email === review.email
```

before showing the delete button.

This means the UI only presents the delete action for the currently stored user's reviews.

---

#  Trailers

The function:

```javascript
show_trailer(videos)
```

searches through the videos:

```javascript
videos.find(video =>
    video.site === "YouTube" &&
    video.type === "Trailer"
);
```

This demonstrates a very useful JavaScript array technique:

```javascript
.find()
```

Instead of manually looping over every video, `.find()` returns the first matching object.

If a trailer exists:

```javascript
$('.teaser')
    .attr('data-key', trailer.key);
```

The key is later used to build:

```text
https://www.youtube.com/embed/{key}?autoplay=1
```

---

#  Favorites and Watchlist

These are handled client-side using `localStorage`.

Two independent arrays are maintained:

```javascript
watchlist
```

and:

```javascript
fav
```

Example:

```javascript
localStorage.setItem(
    'watchlist',
    JSON.stringify([550, 603, 680])
);
```

The values are movie IDs rather than complete movie objects.

This is a good design decision for a small frontend project because movie details can be retrieved from TMDB when needed.

---

#  `toggle_LS()`

The function:

```javascript
toggle_LS(movie_id, list_type)
```

is responsible for adding/removing movie IDs.

For watchlist:

```javascript
let watchlist =
    JSON.parse(
        localStorage.getItem('watchlist')
    ) || [];
```

Then:

```javascript
let index =
    watchlist.indexOf(movie_id);
```

If the movie doesn't exist:

```javascript
watchlist.push(movie_id);
```

Otherwise:

```javascript
watchlist.splice(index, 1);
```

The final array is saved:

```javascript
localStorage.setItem(
    'watchlist',
    JSON.stringify(watchlist)
);
```

The same pattern is used for favorites.

---

# 🔢 Why Convert Movie IDs to Numbers?

The function begins with:

```javascript
movie_id = Number(movie_id);
```

This matters because HTML `data-*` attributes are commonly read as strings.

For example:

```html
data-id="550"
```

may give:

```javascript
"550"
```

while the localStorage array might contain:

```javascript
550
```

Then:

```javascript
indexOf("550")
```

would not equal:

```javascript
indexOf(550)
```

because:

```text
"550" !== 550
```

Converting the ID to a number keeps the data consistent.

---

# 🎨 Updating Favorite/Watchlist Icons

The function:

```javascript
check_icon(movieId)
```

reads both arrays.

It then finds the relevant buttons:

```javascript
.toggle_watchlist[data-id="${movieId}"]
```

and:

```javascript
.toggle_fav[data-id="${movieId}"]
```

If the movie exists, it changes:

```javascript
fa-regular
```

to:

```javascript
fa-solid
```

This gives the user visual feedback about the movie's current state.

---

# 📋 Updating the Watchlist

The function:

```javascript
update_watchlist()
```

gets:

```javascript
localStorage.getItem('watchlist')
```

and loops over the movie IDs.

For each ID:

```javascript
await add_ToList(
    movie_id,
    $container
);
```

is called.

---

# 📋 Updating Favorites

`update_fav()` follows the same pattern.

It retrieves:

```javascript
fav
```

and then calls:

```javascript
add_ToList()
```

for every movie.

This avoids duplicating the movie-card creation logic.

---

# Reusable `add_ToList()`

This function is a good example of reuse:

```javascript
async function add_ToList(
    movie_id,
    $container
)
```

Instead of creating one function for:

```text
watchlist cards
```

and another for:

```text
favorite cards
```

both use the same function.

The movie's complete information is retrieved with:

```javascript
configs.endpoints.movieDetails(movie_id)
```

Then a standard movie card is generated.

---

# Event Delegation

The application frequently creates HTML dynamically.

For example:

```javascript
$container.append(card);
```

The card did not exist when the page initially loaded.

Therefore this would be unreliable:

```javascript
$('.view').on('click', ...)
```

if `.view` elements are created later.

Instead, the project uses:

```javascript
$(document).on(
    'click',
    '.view',
    async function(e) {
        ...
    }
);
```

This is **event delegation**.

The event bubbles to `document`, where jQuery checks whether the clicked element matches:

```text
.view
```

The same technique is used for:

```javascript
.toggle_watchlist
.toggle_fav
.delete-review
.view
.teaser
.close-video
```

This is an important technique when working with dynamically generated DOM elements.

---

# Main UI Event Flow

A movie card contains:

```html
<a
    href="#"
    class="view"
    data-id="550">
    View
</a>
```

When clicked:

```javascript
$(document).on(
    'click',
    '.view',
    async function(e) {

        e.preventDefault();

        let movieId =
            $(this).data('id');

        $('.view_movie')
            .css('left', '0%');

        await movie_details(movieId);
    }
);
```

The flow is:

```text
Click View
    │
    ▼
Read data-id
    │
    ▼
movieId = 550
    │
    ▼
movie_details(550)
    │
    ▼
TMDB request
    │
    ▼
Movie object
    │
    ├── Basic information
    ├── Cast
    ├── Reviews
    └── Videos
    │
    ▼
Update details UI
```

---

# 👤 User Registration

The project has a lightweight client-side registration system.

It is not a real authentication backend.

User information is stored in:

```javascript
localStorage
```

using:

```javascript
"user_dataa"
```

The stored object contains:

```javascript
{
    firstName,
    lastName,
    full_Name,
    email,
    profilePic
}
```

---

# 🧪 Input Validation

`validateInput()` determines which validation rule to use based on:

```javascript
$input.attr("name")
```

For example:

```javascript
switch (name) {
    case "firstName":
    case "lastName":
        ...
        break;

    case "email":
        ...
        break;

    case "password":
        ...
        break;
}
```

This lets one function handle multiple fields.

---

# 📝 `validateForm()`

This function loops through:

```javascript
$(".data input")
```

and calls:

```javascript
validateInput($(this))
```

for each field.

It maintains:

```javascript
let valid = true;
```

and changes it to false if any field fails.

This separates:

```text
individual field validation
```

from:

```text
whole form validation
```

---

#  Saving User Data

`saveUser(user)` converts the object into JSON:

```javascript
JSON.stringify(user)
```

and stores it:

```javascript
localStorage.setItem(
    "user_dataa",
    JSON.stringify(user)
);
```

When the application starts:

```javascript
init_user()
```

checks whether the user already exists.

---

# 🔄 Restoring User State

```javascript
function getStoredUser() {
    let user =
        localStorage.getItem("user_dataa");

    return user
        ? JSON.parse(user)
        : null;
}
```

This demonstrates a very important localStorage pattern:

```text
JavaScript object
      │
      ▼
JSON.stringify()
      │
      ▼
localStorage
      │
      ▼
JSON string
      │
      ▼
JSON.parse()
      │
      ▼
JavaScript object
```

---

# 🚪 Logout

`logoutUser()` removes:

```javascript
localStorage.removeItem(
    "user_dataa"
);
```

Then it resets the UI and shows the registration form again.

---

# Theme System

The application stores:

```javascript
theme
```

in localStorage.

Possible values:

```text
light
dark
```

The theme is restored when the application starts using:

```javascript
update_theme()
```

If the stored theme is dark:

```javascript
$('body').addClass('dark');
```

Otherwise:

```javascript
$('body').removeClass('dark');
```

When the checkbox changes:

```javascript
$('#mode').on('change', ...)
```

the new theme is saved.

---

# ⏳ Loading State

The project keeps track of active API requests:

```javascript
$activeRequests = 0;
```

Before an API request:

```javascript
$activeRequests++;
```

After it finishes:

```javascript
$activeRequests--;
```

The loading modal is shown only when the first request begins:

```javascript
if ($activeRequests === 1) {
    $loadingModal.show();
}
```

And hidden after the final active request finishes:

```javascript
if ($activeRequests === 0) {
    ...
}
```

This is better than simply doing:

```javascript
show loading
request
hide loading
```

because multiple asynchronous requests can happen at the same time.

---

# Function Reference

## API / Networking

| Function | Purpose |
|---|---|
| `build_url()` | Combines base URL, endpoint, defaults, and custom query parameters |
| `get_lists()` | Main reusable TMDB request function |
| `get_movie()` | Sends a watchlist request to TMDB account endpoint |

---

## Movie Discovery

| Function | Purpose |
|---|---|
| `trending_show()` | Retrieves and displays trending movies |
| `popular_show()` | Retrieves popular movies by selected genres |
| `top_rated_show()` | Retrieves top-rated movies |
| `filter()` | Builds TMDB filtering parameters |
| `searchin()` | Searches TMDB movies |
| `back_home()` | Restores the normal home UI |

---

## Movie Details

| Function | Purpose |
|---|---|
| `movie_details()` | Retrieves and displays complete movie information |
| `show_cast()` | Displays movie cast |
| `show_reviews()` | Displays TMDB reviews |
| `show_trailer()` | Finds a YouTube trailer |

---

## Favorites / Watchlist

| Function | Purpose |
|---|---|
| `toggle_LS()` | Adds/removes a movie ID from localStorage |
| `check_icon()` | Updates favorite/watchlist icons |
| `update_watchlist()` | Rebuilds watchlist UI |
| `update_fav()` | Rebuilds favorites UI |
| `add_ToList()` | Retrieves movie details and creates a reusable card |
| `checkWatchlistEmpty()` | Shows/hides empty-watchlist UI |
| `checkFavoritesEmpty()` | Shows/hides empty-favorites UI |

---

## User System

| Function | Purpose |
|---|---|
| `init_user()` | Initializes stored user state |
| `getStoredUser()` | Reads user data from localStorage |
| `validateInput()` | Validates individual fields |
| `validateForm()` | Validates the complete form |
| `submitForm()` | Processes registration |
| `saveUser()` | Stores user data |
| `showRegistrationForm()` | Displays registration UI |
| `showUserProfile()` | Displays stored user profile |
| `logoutUser()` | Logs the user out |
| `updateNavbarUser()` | Updates navbar based on user state |

---

## Reviews

| Function | Purpose |
|---|---|
| `write_review()` | Validates and submits local review |
| `saveReview()` | Stores review in localStorage |
| `load_Reviews()` | Loads locally stored reviews |
| `delete_review()` | Deletes a local review |

---

## UI

| Function | Purpose |
|---|---|
| `update_theme()` | Restores saved theme |

---

#  Complete Application Data Flow

A simplified version of the whole application is:

```text
                         APPLICATION START
                                │
                                ▼
                         update_theme()
                                │
                                ▼
                           init_user()
                                │
                ┌───────────────┼───────────────┐
                ▼               ▼               ▼
         trending_show()  top_rated_show()  popular_show()
                │               │               │
                └───────────────┼───────────────┘
                                ▼
                           get_lists()
                                │
                                ▼
                           build_url()
                                │
                                ▼
                           $.ajax()
                                │
                                ▼
                            TMDB API
                                │
                                ▼
                         JSON response
                                │
                                ▼
                      Generate HTML cards
```

When the user clicks a movie:

```text
Movie Card
   │
   ▼
.view click
   │
   ▼
movie_details(movieId)
   │
   ▼
TMDB /movie/{id}
   │
   ├── credits
   ├── reviews
   └── videos
   │
   ▼
Update details page
   │
   ├── Movie information
   ├── Cast
   ├── Reviews
   └── Trailer
```

---

#  The Most Important Programming Ideas Demonstrated

This project is useful as a learning project because it combines many concepts together.

## 1. API abstraction

Instead of repeating AJAX logic everywhere:

```javascript
get_lists(...)
```

centralizes communication.

---

## 2. Configuration objects

Instead of scattering URLs throughout the code:

```javascript
configs.endpoints
```

centralizes them.

---

## 3. Nested objects

Examples:

```javascript
configs.endpoints
configs.defaults
genres.Action
movie.credits.cast
movie.reviews.results
movie.videos.results
```

This teaches how hierarchical data is represented in JavaScript.

---

## 4. Arrays of objects

TMDB responses contain structures such as:

```javascript
[
    {
        id: 1,
        title: "...",
        vote_average: 8
    },

    {
        id: 2,
        title: "...",
        vote_average: 7
    }
]
```

You then use:

```javascript
forEach()
```

```javascript
$.each()
```

```javascript
slice()
```

```javascript
find()
```

```javascript
filter()
```

and:

```javascript
map()
```

to manipulate that data.

---

#  Useful JavaScript Patterns Used

## `.map()`

Used when transforming one array into another.

Example:

```javascript
watchlist.map(String)
```

---

## `.filter()`

Used to remove objects that don't satisfy a condition.

Example:

```javascript
reviews[movieId].filter(
    review => review.id != reviewId
);
```

---

## `.find()`

Used to find one object matching a condition.

Example:

```javascript
videos.find(video =>
    video.site === "YouTube" &&
    video.type === "Trailer"
);
```

---

## `.slice()`

Used to limit displayed data.

Example:

```javascript
movie_list.slice(0, 20)
```

means:

> Take movies starting at index 0 up to, but not including, index 20.

---

## `.forEach()`

Used to execute something for every item.

Example:

```javascript
cast.slice(0, 8).forEach(actor => {
    ...
});
```

---

#  How to Build a Similar Project From Scratch

If you're building your own API-based movie application, don't start by writing everything at once.

Use this progression.

---

## Phase 1 — Understand the API

Before writing UI code, understand:

```text
Base URL
Endpoints
HTTP methods
Query parameters
Headers
Authentication
JSON response structure
```

Practice requests manually first.

---

## Phase 2 — Create Your Configuration

Create:

```javascript
const config = {
    baseUrl: "...",

    endpoints: {
        ...
    },

    defaults: {
        ...
    },

    headers: {
        ...
    }
};
```

---

## Phase 3 — Build URL Generation

Create:

```javascript
build_url()
```

and make sure you can generate:

```text
endpoint + query parameters
```

correctly.

---

## Phase 4 — Build One Generic Request Function

Create something similar to:

```javascript
get_lists()
```

Your goal is to make this work:

```javascript
get_lists(
    config.endpoints.popular,
    {},
    'GET'
);
```

before building the rest of the UI.

---

# Phase 5 — Display One Movie

Take one object:

```javascript
movie
```

and manually create a card.

For example:

```javascript
function createMovieCard(movie) {
    return `
        <div class="card">
            <img src="...">
            <h3>${movie.title}</h3>
        </div>
    `;
}
```

---

# Phase 6 — Display Arrays

Once one movie works:

```javascript
movie_list.forEach(movie => {
    ...
});
```

Now you can display many movies.

---

# Phase 7 — Add Search

Connect:

```text
input
  ↓
query
  ↓
API
  ↓
results
  ↓
cards
```

---

# Phase 8 — Add Filters

Create a mapping object:

```javascript
genres
```

Then convert UI selections into API parameters.

---

# Phase 9 — Add Details

Use:

```javascript
/movie/{id}
```

and learn how nested response data works.

---

# Phase 10 — Add Local State

Use localStorage for:

```text
favorites
watchlist
theme
user
reviews
```

---

# Phase 11 — Add Event Delegation

Once your cards become dynamic, use:

```javascript
$(document).on(...)
```

for dynamically generated elements.

---

# Phase 12 — Refactor

Once everything works, identify duplicated code.

For example:

```text
search cards
popular cards
filter cards
watchlist cards
favorite cards
```

all create very similar HTML.

This is where you should consider creating:

```javascript
createMovieCard(movie)
```

instead of duplicating the template.

---

#  Security Considerations

## Never commit API credentials

The original project code contains a TMDB Bearer token and session information.

Do **not** put real credentials into a public GitHub repository.

If a real token has already been published publicly, treat it as exposed and regenerate/revoke it where applicable.

For a production application, API credentials that must remain secret should be handled server-side rather than embedded in frontend JavaScript.

---

#  localStorage Is Not Authentication

The registration system in this project is suitable as a **frontend learning/demo feature**.

It is not real authentication.

For example:

```javascript
localStorage.setItem(
    "user_dataa",
    JSON.stringify(user)
);
```

does not create a secure account.

A real authentication system would normally require:

```text
Frontend
    │
    ▼
Backend
    │
    ├── Database
    ├── Password hashing
    ├── Authentication
    ├── Authorization
    └── Sessions / tokens
```

This distinction is important when moving from a portfolio project to a production application.

---
