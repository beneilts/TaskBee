import { useParams } from "react-router-dom"
import { gql, useQuery, useMutation } from '@apollo/client'
import { useState } from "react"
import {StarIcon} from '@heroicons/react/outline';
import {StarIcon as StarIconSolid, PlusIcon, XIcon} from '@heroicons/react/solid';
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

// Mutation for creating a new list

const Board = () => {
    const { user }: any = useOutletContext();
    const [notFound, setNotFound] = useState(false)
    const [boardData, setBoardData] = useState<any>(undefined)
    const [newList, setNewList] = useState({showInput: false, name: ""})
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

    const createList = () => {
        if (newList.name === "") return
        console.log("Creating list "+newList.name)

        // try {
        //     await mutateBoard({
        //         variables: {
        //             name: values.name,
        //             description: values.description,
        //             created_by: user.id,
        //             private: values.private,
        //             background_is_image: false,
        //             background_value: values.background
        //         },

        //         onCompleted: (data) => {
        //             //toast.success('Board created', { id: 'createBoard' })
        //             navigate(`/boards/${data.insert_boards_one.id}`)
        //         },
        //         onError: (apolloError) => {
        //             toast.error('Unable to create board', { id: 'createBoard' })
        //             console.log(apolloError)
        //         }
        //     })
            
        // } catch (error) {
        //     toast.error('Unable to create board', { id: 'createBoard' })
        // }

        setNewList({showInput: false, name: ""})
    }

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

                        {newList.showInput ? 
                            <div className="w-60 h-min flex flex-col space-y-2 p-2 space-x-1 rounded-md bg-[#ebecf0]">
                                <input className="rounded_sm border-2 border-orange-500 text-[#172b4d] px-2 py-1"
                                    value={newList.name}
                                    onChange={(e) => setNewList({...newList, name: e.target.value})}
                                ></input>
                                <div className="flex">
                                    <button className="bg-orange-500 px-3 py-1 rounded-sm hover:bg-orange-600" onClick={createList}>Add list</button>
                                    <button><XIcon className="w-6 ml-2 text-gray-600 hover:text-gray-400"
                                        onClick={() => setNewList({showInput: false, name: ""})}
                                    /></button>
                                </div>
                            </div>
                        :
                            <button className="text-white h-10 w-60 flex items-center px-2 py-1 space-x-1 rounded-md bg-white/20 hover:bg-white/30"
                            onClick={() => setNewList({showInput: true, name: ""})}>
                                <PlusIcon className="w-5 ml-2"/>
                                <p>Add a new list</p>
                            </button>
                        }
                        

                        
                        
                    </body>
                </div>
            : null}
        </>
    )
}

export default Board