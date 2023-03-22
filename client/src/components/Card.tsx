
const Card = ({title}:{title: string}) => {
    return (
        <button className="bg-slate-100 text-left rounded-sm px-2 py-1 drop-shadow-sm border-b border-zinc-300">
            {title}
        </button>
    )
}

export default Card