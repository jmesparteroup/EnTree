export default function Container({ children, className, onClick }) {
    return (
        <div onClick={onClick} className={`shadow-lg rounded-md bg-white ${className}`}>
            {children}
        </div>
    )
}