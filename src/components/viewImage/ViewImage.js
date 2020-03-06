import React from 'react'


export default function ViewImage(props) {
    return (<div className="modal">
        <div className="modal-content">
            <div className="modal-header">
                <span className="close" onClick={props.closeModal}>&times;</span>
                <div><img src={props.detail.user.profile_image.small} alt={props.detail.user.name} />
                    <span className="user-name">{props.detail.user.name}
                        <div className="name-caption"><small>@{props.detail.user.username}</small></div>
                    </span>
                </div>
            </div>
            <div className="modal-body">

                <img src={props.detail.urls.regular} className="detail-img" alt={props.detail.alt_description} />
            </div>
            <div className="modal-footer">
                <h3 className="text-center"><a className="download" href={`${props.detail.links.download}?force=true`} download={props.detail.alt_description}>Download</a>
                </h3>
            </div>
        </div>

    </div>)

}
