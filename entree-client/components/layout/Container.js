export default function Container({ children, className, onClick }) {
    return (
        <div onClick={onClick} className={`shadow-lg ${className}`}>
            {children}
        </div>
    )
}