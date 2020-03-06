import React, { useEffect, useReducer, useState } from 'react'
import axios from 'axios';
import HomeReducer from '../../reducers/HomeReducer'
import search_icons from '../../search_icons.png';
import ViewImage from '../viewImage/ViewImage'
import AjaxLoader from '../ajaxLoader/AjaxLoader'

import Footer from '../footer/footer'

function Home() {

    const initialState = {
        loading: true,
        error: '',
        searched_photos: [],
        randomPhoto: {},
        fetching: false,

    };

    const tangsState = ['Dog', 'Cat', 'Space', 'Nature', 'Business', 'Office', 'Coffee', 'World']


    const [tags, setTags] = useState(tangsState);

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

        } else if (keyCode === 13 && event.target.value === '') {
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

    const TagsLists = () => {
        const listItems = tags.map((t, i) =>
            <li key={i}>{t}</li>
        );
        return (
            <ul className="tag-list">
                <li><b>Search by tags:</b></li>
                {listItems}
            </ul>
        );
    }


    return (
        <React.Fragment>
            {state.loading ? <AjaxLoader /> : <div className='bg-img' style={{ backgroundImage: `url(${state.randomPhoto})` }}>
            <div className="bg-div"></div>
                <div className="photo-wrapper">
                    <header><h2 className="logo-text">Search<span>it</span></h2></header>
                    <h2 className="heading-text">Free stock photos for everybody</h2>
                    <p className="sub-heading-text"><small>We offer the best free stock photo's all in one place</small></p>

                    <TagsLists />

                    <div className="searchBox">

                        <input className="searchInput" type="text" name="" placeholder="Search for images here..." onChange={handleChange} />
                        <button className="searchButton" id="searchImg">
                            <img src={search_icons} alt="Search" />
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

                {isFechDetail ? <ViewImage detail={detail} closeModal={closeModal} /> : ''}
               
            </div>}
            

            {state.error ? state.error : null}

            {state.fetching ? <AjaxLoader /> : null}
            {state.loading ? '' : <Footer />}
        </React.Fragment>
    )
}

export default Home
