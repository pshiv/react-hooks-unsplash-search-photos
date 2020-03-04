const HomeReducer = (state, action) => {
    switch (action.type) {
        case "FETCH_RANDOM_PHOTOS":
            return {
                ...state,
                loading: false,
                error: '',
                randomPhoto: action.payload
            }
        case "FETCHING":
            return {
                ...state,
                fetching: true,
                error: ''
            }
        case "FETCH_PHOTOS_LIST":
            return {
                ...state,
                fetching: false,
                error: '',
                searched_photos: action.payload
            }
        case "FETCH_ERROR":
            return {
                ...state,
                fetching: false,
                error: 'Something went wrong',
                post: {}
            }
        default:
            return state
    }
}

export default HomeReducer