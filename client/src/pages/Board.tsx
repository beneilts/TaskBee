import { useParams } from "react-router-dom"
import { gql, useQuery, useMutation } from '@apollo/client'
import { useState, useEffect } from "react"
import { toast } from 'react-hot-toast'
import {StarIcon} from '@heroicons/react/24/outline';
import {StarIcon as StarIconSolid, PlusIcon, XMarkIcon} from '@heroicons/react/24/solid';

import { useOutletContext } from 'react-router-dom';
import List from "../components/List";

// Query for getting a board by board_id
const GET_BOARDS = gql`
  query GetBoards($board_id: Int) {
  boards(where: {id: {_eq: $board_id}}) {
    members(where: {board_id: {_eq: $board_id}}) {
      user {
        displayName
      }
      visited_at
      starred
    }
    lists(where: {board_id: {_eq: $board_id}}, order_by: {position: asc_nulls_last}) {
        created_at
        id
        board_id
        name
        position
        updated_at
    }
    cards(where: {board_id: {_eq: $board_id}}, order_by: {position: asc_nulls_last}) {
        created_at
        created_by
        description
        name
        position
        updated_at
        id
        list_id
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
const CREATE_LIST = gql`
    mutation CreateList($board_id: Int, $name: String) {
        insert_lists_one(object: {board_id: $board_id, name: $name}) {
            id
        }
    }
`

const Board = () => {
    const { user }: any = useOutletContext();
    const [notFound, setNotFound] = useState(false)
    const [boardData, setBoardData] = useState<any>(undefined)
    const [newList, setNewList] = useState({showInput: false, name: ""})
    const [mutateList, ] = useMutation(CREATE_LIST)
    const { boardId } = useParams()
    
    const { loading, error, data, refetch} = useQuery(GET_BOARDS, {
        variables: { board_id: boardId },
        onCompleted: (data) => {
            if (data.boards[0])
                setBoardData(data.boards[0]); 
            else
                setNotFound(true)
            
        },
        onError: (apolloError) => {
            console.log(apolloError)
        }
    })

    const createList = async () => {
        if (newList.name === "") return
        console.log("Creating list "+newList.name)

        try {
            await mutateList({
                variables: {
                    name: newList.name,
                    board_id: boardId
                },

                onCompleted: (data) => {
                    refetch()
                },
                onError: (apolloError) => {
                    toast.error('Unable to create list')
                    console.log(apolloError)
                }
            })
            
        } catch (error) {
            toast.error('Unable to create board')
        }

        setNewList({showInput: false, name: ""})
    }

    useEffect(() => {  
        if (newList.showInput) {
            document.getElementById("new_list_input")?.focus()
        }
    }, [newList])

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
                        {boardData.lists.map((list: any) => <List 
                            key={list.id} 
                            listData={list} 
                            cards={boardData.cards.filter((card:any) => card.list_id == list.id)}
                            refetchBoard = {refetch}
                        />)}

                        {newList.showInput ? 
                            <div className="w-60 h-min flex flex-col space-y-2 p-2 space-x-1 rounded-md bg-[#ebecf0]"
                                /* onBlur={() => setNewList({...newList, showInput: false})} */
                            >
                                <input className="rounded_sm border-2 outline-none border-orange-500 text-[#172b4d] px-2 py-1"
                                    id = "new_list_input"
                                    placeholder="Enter list title..."
                                    value={newList.name}
                                    onChange={(e) => setNewList({...newList, name: e.target.value})}
                                ></input>
                                <div className="flex">
                                    <button className="bg-orange-500 px-3 py-1 rounded-sm hover:bg-orange-600" onClick={createList}>Add list</button>
                                    <button><XMarkIcon className="w-6 ml-2 text-gray-600 hover:text-gray-400"
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