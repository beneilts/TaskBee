import { useOutletContext } from 'react-router-dom';
import { Helmet } from 'react-helmet'
import { gql, useQuery } from '@apollo/client'
import Board from '../components/Board';

// Query for getting a user's boards
const GET_BOARDS_QUERY = gql`
  query GetBoardsByUser($userId: uuid) {
  boards(where: {
    _or: [
      {created_by: {_eq: $userId}},
      {members: {user_id: {_eq: $userId}}}
    ]
  }) {
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
        variables: { userId: user.id }
    })

    return (
        <>
            <Helmet>
                <title>Dashboard - TaskBee</title>
            </Helmet>

            <div>
                <h1 className='text-black text-2xl pb-4'>Boards</h1>

                {error ? 
                    <p>Could not load boards. Try to refresh the page.</p>
                : !loading ? 
                    <div className='grid grid-cols-4 gap-5 overflow-y-auto h-96'> 
                        {data?.boards.map((board: any) => <Board key={board.id} data={board}/>)}
                    </div>
                : null}
            </div>
        </>
    );
};

export default Dashboard;
