import { useOutletContext } from 'react-router-dom';
import { Helmet } from 'react-helmet'
import { gql, useQuery } from '@apollo/client'
import { useState } from 'react';

import Board from '../components/Board';
import CreateBoard from '../components/CreateBoard';

// Query for getting a user's boards
const GET_BOARDS_QUERY = gql`
  query GetBoardsByUser($userId: uuid) {
  boards(where: {members: {user_id: {_eq: $userId}}}) {
    members(where: {user_id: {_eq: $userId}}) {
      visited_at
      starred
    }
    id
    name
    private
    background_is_image
    background_value
    created_at
    created_by
  }
}
`

const Dashboard = () => {
    const { user }: any = useOutletContext();
    const { loading, error, data } = useQuery(GET_BOARDS_QUERY, {
        variables: { userId: user.id },
    })
    let [showModal, setShowModal] = useState(false)
    let boards
    

    // sort boards by visited_at date
    if (!loading) {
        boards = data?.boards.slice()
        boards.sort((a:any, b:any) => {
            let dateA = new Date(a.members[0].visited_at)
            let dateB = new Date(b.members[0].visited_at)
            return dateA.getTime() - dateB.getTime()
        })
    }

    const handleCloseModal = () => {
        setShowModal(false)
    }

    return (
        <div className='flex justify-center'>
            <Helmet>
                <title>Dashboard - TaskBee</title>
            </Helmet>

            <div className='w-2/3 pt-10'>
                <h1 className='text-black text-2xl pb-4'>Boards</h1>

                {error ? 
                    <p>Could not load boards. Try to refresh the page.</p>
                : !loading ? 
                    <div className='grid grid-cols-4 gap-5 overflow-y-auto h-96'> 
                        <button className={`text-black p-4 w-72 h-40 rounded-md bg-zinc-100 hover:bg-zinc-200`} 
                        onClick = {() => setShowModal(true)}>
                            <h2>Create a new board</h2>
                        </button>
                        {boards.map((board: any) => <Board key={board.id} data={board}/>)}
                    </div>
                : null}

                {showModal ? 
                    <CreateBoard closeClicked={handleCloseModal}/>
                : null}
            </div>
        </div>
    );
};

export default Dashboard;
