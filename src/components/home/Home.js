import React, { useEffect, useReducer, useState } from 'react'
import axios from 'axios';
import HomeReducer from '../../reducers/HomeReducer'
import search_icons from '../../search_icons.png';

function Home() {

    const initialState = {
        loading: true,
        error: '',
        searched_photos: [],
        randomPhoto: {},
        fetching: false,

    };


    const [state, dispatch] = useReducer(HomeReducer, initialState);

    const [photo, setPhoto] = useState('');    
    const [isFechDetail, setisFechDetail] = useState(false);
    const [detail, setDetail] = useState({});
    const [pageNo, setPageNo] = useState(1);
    const [photoList, setphotoList] = useState([]);
    const [isSearch, setIsSearch] = useState(false);
    const [timer, setTimer] = useState(null)


    const handleChange = (event) => {

        setphotoList([]);

        window.addEventListener('keyup', function (event) {
            clearTimeout(timer);
            setTimeout(callAPI(event), 5000)
            setTimer(null)
        })


    }

    const callAPI = (event) => {
        const { keyCode } = event;
        if (keyCode === 13 && event.target.value !== '') {            
            setphotoList([])           
            setIsSearch(true);
            setPhoto(event.target.value);

        } else if(keyCode === 13 && event.target.value === ''){
            setPageNo(1)
            setIsSearch(false)
        }
    }

    const getDetail = (event) => {
        var imageDetail = state.searched_photos.find(item => item.id === event.target.id)
        setisFechDetail(true);
        setDetail(imageDetail)
        console.log(imageDetail)
    }

    const closeModal = () => {
        setisFechDetail(false);
    }


    useEffect(() => {
        axios.get(`https://source.unsplash.com/random/1600x900`)
            .then(function (res) {
                console.log(res.request.responseURL)
                dispatch({
                    type: 'FETCH_RANDOM_PHOTOS',
                    payload: res.request.responseURL
                })
            }).catch(function (err) {
                dispatch({
                    type: 'FETCH_ERROR'
                })
            });
        return () => {
            // cleanup
        };

        console.log("Random useEffect")
    }, []);


    useEffect(() => {
        const clientId = 'CHFWX96KIusgaTxWBs2aS4owrNRerIYB5OAzIol0Ccw'
        const URL_list = `https://api.unsplash.com/photos?&client_id=${clientId}&page=${pageNo}&per_page=9&order_by=latest`
        const URL_Search = `https://api.unsplash.com/search/photos?&query=${photo}&page=${pageNo}&client_id=${clientId}&per_page=9`
        dispatch({
            type: 'FETCHING'
        })
        const URL = isSearch ? URL_Search : URL_list
        axios.get(URL)
            .then(function (res) {
                var resType = isSearch ? res.data.results : res.data
                var arr = photoList.concat(resType)
                setphotoList(arr)
                dispatch({
                    type: 'FETCH_PHOTOS_LIST',
                    payload: arr
                })

            }).catch(function (err) {
                dispatch({
                    type: 'FETCH_ERROR'
                })
            });

        return () => {
            // cleanup
        };
    }, [pageNo, isSearch, photo]);


    const loadPhotos = () => {
        setPageNo(prevPageNo => prevPageNo + 1)
    }


    const ClickedImageView = () => {
        return (<div className="modal">
            <div className="modal-content">
                <div className="modal-header">
                    <span className="close" onClick={closeModal}>&times;</span>
                    <div><img src={detail.user.profile_image.small} alt={detail.user.name} />
                        <span>{detail.user.name}
                            <div><small>@{detail.user.username}</small></div>
                        </span>
                    </div>
                </div>
                <div className="modal-body">

                    <img src={detail.urls.regular} className="detail-img" alt={detail.alt_description} />
                </div>
                <div className="modal-footer">
                    <h3 className="text-center"><a className="download" href={`${detail.links.download}?force=true`} download={detail.alt_description}>Download</a>
                    </h3>
                </div>
            </div>

        </div>)
    }

    const ajaxLoader = () => {
        return (<div className="overlay"><span className="text">Fetching...</span></div>)
    }


    return (
        <React.Fragment>
            {state.loading ? ajaxLoader() : <div className='bg-img' style={{ backgroundImage: `url(${state.randomPhoto})` }}>
                <div className="photo-wrapper">
                    <div className="searchBox">

                        <input className="searchInput" type="text" name="" placeholder="Search for images here..." onChange={handleChange} />
                        <button className="searchButton" id="searchImg">
                            <img src={search_icons} alt="Search"/>
                        </button>
                    </div>
                    <div className="img-wrapper">
                        {state.searched_photos.legth >= 1 ? "Fetching" :
                            state.searched_photos.map((p, index) => {
                                return <div className="card" key={index}><img id={p.id} onClick={getDetail} className="thumbnail" src={p.urls.regular} alt={p.alt_description} />
                                    <article><img src={p.user.profile_image.small} alt={p.user.name} /> <label>Image by <span>{p.user.name}</span></label> </article>
                                </div>
                            })
                        }


                    </div>
                    {state.searched_photos.legth >= 1 ? '' : <p className="text-center"><span className="btn" onClick={loadPhotos}>Load More</span></p>}
                </div>

                {isFechDetail ? ClickedImageView() : ''}

            </div>}

            {state.error ? state.error : null}

            {state.fetching ?  ajaxLoader(): null}
        </React.Fragment>
    )
}

export default Home
