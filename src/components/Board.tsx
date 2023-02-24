
const Board = ({ data }: { data: any }) => {
    console.log(data.name)
    //${data.background_value}
    return (
        <div className={`text-black p-4 font-bold w-72 h-40 border-2 border-black rounded-md ${!data.background_is_image ? `bg-[#3d96aa]` : ''}`} >
            {/* <img src="image1.jpg" alt="Image 1" className="w-full"> */}
            <div >
                <h2>{data.name}</h2>
            </div>
        </div>
    )
}

export default Board