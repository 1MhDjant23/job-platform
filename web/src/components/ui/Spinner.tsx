
interface Props {
    size?: 'sm' | 'md' | 'lg',
    color?: string
}

const   sizes = {
    sm: 'w-4 h-4 border-2',
    md: 'w-6 h-6 border-2',
    lg: 'w-8 h-8 border-4'
};

export  function Spinner({ size='md', color='border-white' }: Props) {
    return (
        <div
            className={`
                ${sizes[size]}
                ${color}
                border-t-transparent
                rounded-full
                animate-spin
                inline-block
            `}
        />
    );

}