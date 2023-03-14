import {StarIcon} from '@heroicons/react/24/outline';
import {StarIcon as StarIconSolid} from '@heroicons/react/24/solid';
import { Link } from 'react-router-dom';

const Board = ({ data }: { data: any }) => {
    return (
        <Link to={`/boards/${data.id}`} style={{backgroundColor: (!data.background_is_image ? data.background_value : null)}} className={`text-white p-4 font-bold w-72 h-40 rounded-md relative`} >
            {/* <img src="image1.jpg" alt="Image 1" className="w-full"> */}
            <h2>{data.name}</h2>
            <button className='w-5 absolute bottom-2 right-2'>
                {data.members[0].starred ? <StarIconSolid /> : <StarIcon />}
            </button>
        </Link>
    )
}

export default Board