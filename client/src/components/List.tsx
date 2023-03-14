import Card from "./Card"
import { PlusIcon } from "@heroicons/react/24/solid"

const List = () => {
    return (
        <div className="bg-[#ebecf0] text-[#172b4d] rounded-md w-60 p-2 flex flex-col space-y-2">
            <button className="font-semibold px-1 text-left">List Name</button>
            <Card />
            <Card />
            <Card />
            <button className=" text-gray-500 flex px-2 py-1 space-x-1 rounded-sm hover:bg-gray-300">
                <PlusIcon className="w-5"/>
                <p>Add a card</p>
            </button>
        </div>
    )
}

export default List
