import { useParams } from "react-router-dom"
import { gql, useQuery } from '@apollo/client'
import { useState } from "react"
import {StarIcon} from '@heroicons/react/outline';
import {StarIcon as StarIconSolid} from '@heroicons/react/solid';
import { useOutletContext } from 'react-router-dom';
import List from "../components/List";

// Query for getting a board by boardId
const GET_BOARDS_QUERY = gql`
  query GetBoardsByUser($boardId: Int) {
  boards(where: {id: {_eq: $boardId}}) {
    members(where: {board_id: {_eq: $boardId}}) {
      user {
        displayName
      }
      visited_at
      starred
    }
    name
    private
    background_is_image
    background_value
    created_at
    created_by
  }
}
`

const Board = () => {
    const { user }: any = useOutletContext();
    const [notFound, setNotFound] = useState(false)
    const [boardData, setBoardData] = useState<any>(undefined)
    const { boardId } = useParams()
    const { loading, error, data } = useQuery(GET_BOARDS_QUERY, {
        variables: { boardId: boardId },
        onCompleted: (data) => {
            if (data.boards[0]) 
                setBoardData(data.boards[0])
            else
                setNotFound(true)
            
        }
    })

    return (
        <>
            {error ? 
                <p>Could not load board. Try to refresh the page.</p>
            : notFound ? 
                <p>Board not found</p>
            : !loading && boardData? 
                <div style={{backgroundColor: (!boardData.background_is_image ? boardData.background_value : null)}} className="h-full text-white">
                    <header className="h-10 flex items-center">
                        <h1 className="font-bold text-xl ml-10">{data.boards[0]?.name}</h1>
                        <button className='w-5 ml-5'>
                            {boardData.members[0].starred ? <StarIconSolid /> : <StarIcon />}
                        </button>
                    </header>
                    <body className="flex space-x-3 px-3">
                        <List />
                        <List />
                        <List />
                    </body>
                </div>
            : null}
        </>
    )
}

export default Board