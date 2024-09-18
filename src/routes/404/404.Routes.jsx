import {Link} from 'react-router-dom';

const PageNotFound = () => {
    return (
        <div style={{marginTop: '45vh', textAlign: 'center'}}>
            404 <br/>
            <Link to={"/"}>Back To Home</Link>
        </div>
    )
}

export default PageNotFound;