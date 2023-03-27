import Card from "./Card"
import { PlusIcon, XMarkIcon } from "@heroicons/react/24/solid"
import { gql, useMutation, ApolloQueryResult } from '@apollo/client'
import { useState, useEffect, useRef } from "react"
import { toast } from 'react-hot-toast'

// Mutation for creating a new card
const CREATE_CARD = gql`
    mutation CreateCard($board_id: Int!, $list_id: Int!, $name: String!) {
        insert_cards_one(object: {board_id: $board_id, list_id: $list_id, name: $name}) {
        id
    }
}
`

const List = ({ listData, cards, refetchBoard }: { 
    listData: any, 
    cards: any, 
    refetchBoard: (variables?: Partial<{board_id: string | undefined;}> | undefined) => Promise<ApolloQueryResult<any>>
}) => {

    const [newCard, setNewCard] = useState({ showInput: false, name: "" })
    const [mutateCard, ] = useMutation(CREATE_CARD)

    useEffect(() => {
        if (newCard.showInput) {
            document.getElementById("new_card_input")?.focus()
        }
    }, [newCard])

    const createCard = async () => {
        console.log("Here")
        if (newCard.name === "") return
        console.log("Creating card " + newCard.name)

        try {
            await mutateCard({
                variables: {
                    name: newCard.name,
                    board_id: listData.board_id,
                    list_id: listData.id
                },

                onCompleted: (data) => {
                    refetchBoard()
                },
                onError: (apolloError) => {
                    toast.error('Unable to create card')
                    console.log(apolloError)
                }
            })

        } catch (error) {
            console.log(error)
            toast.error('Unable to create card')
        }

        setNewCard({...newCard, showInput: false})
    }

    return (
        <div className="bg-[#ebecf0] text-[#172b4d] h-min rounded-md w-60 p-2 flex flex-col space-y-2">
            <button className="font-semibold px-1 text-left">{listData.name}</button>
            {cards.map((card: any) => <Card title={card.name} />)}

            {newCard.showInput ?
                <div className="flex flex-col space-y-2"> {/* onBlur={() => setNewCard({ ...newCard, showInput: false})} */}
                    <textarea id="new_card_input" className="bg-slate-100 text-left break-words resize-none overflow-hidden rounded-sm outline-none px-2 py-1 drop-shadow-sm border-b border-zinc-300"
                        placeholder="Enter a title for this card..."
                        value={newCard.name}
                        onChange={(e) => setNewCard({ ...newCard, name: e.target.value })}
                    ></textarea>

                    <div className="flex">
                        <button className="text-white bg-orange-500 px-3 py-1 rounded-sm hover:bg-orange-600" onClick={createCard}>Add card</button>
                        <button><XMarkIcon className="w-6 ml-2 text-gray-600 hover:text-gray-400"
                            onClick={() => setNewCard({ showInput: false, name: "" })}
                        /></button>
                    </div>
                </div>
                :
                <button className=" text-gray-500 flex px-2 py-1 space-x-1 rounded-sm hover:bg-gray-300"
                    onClick={() => setNewCard({ showInput: true, name: "" })}>
                    <PlusIcon className="w-5" />
                    <p>Add a card</p>
                </button>
            }
        </div>
    )
}

export default List
